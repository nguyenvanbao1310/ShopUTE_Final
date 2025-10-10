import { Transaction } from "sequelize";
import sequelize from "../config/configdb";
import Cart from "../models/Cart";
import CartItem from "../models/CartItem";
import Product from "../models/Product";
import ProductDiscount from "../models/ProductDiscount";

type CartCtx = { userId?: number | null; deviceId?: string | null };
type CartWithItems = Cart & { items?: CartItem[] };

async function getOrCreateCart(ctx: CartCtx) {
  if (ctx.userId) {
    let cart = await Cart.findOne({ where: { userId: ctx.userId } });
    if (!cart) cart = await Cart.create({ userId: ctx.userId, deviceId: null });
    return cart;
  }
  if (ctx.deviceId) {
    let cart = await Cart.findOne({ where: { deviceId: ctx.deviceId } });
    if (!cart)
      cart = await Cart.create({ userId: null, deviceId: ctx.deviceId });
    return cart;
  }
  throw new Error("NO_CART_CONTEXT");
}

export async function addItem(ctx: CartCtx, productId: number, quantity = 1) {
  return await sequelize.transaction(async (t: Transaction) => {
    const cart = await getOrCreateCart(ctx);
    const product = await Product.findByPk(productId, { transaction: t });
    if (!product) throw new Error("PRODUCT_NOT_FOUND");

    const existing = await CartItem.findOne({
      where: { cartId: cart.id, productId },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (existing) {
      await existing.update(
        { quantity: existing.quantity + Math.max(1, quantity) },
        { transaction: t }
      );
      return existing;
    }
    return await CartItem.create(
      {
        cartId: cart.id,
        productId,
        quantity: Math.max(1, quantity),
        selected: true,
      },
      { transaction: t }
    );
  });
}

export async function updateItem(
  ctx: CartCtx,
  cartItemId: number,
  params: { quantity?: number; selected?: boolean }
) {
  return await sequelize.transaction(async (t) => {
    const cart = await getOrCreateCart(ctx);
    const item = await CartItem.findOne({
      where: { id: cartItemId, cartId: cart.id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!item) throw new Error("CART_ITEM_NOT_FOUND");

    const patch: any = {};
    if (params.quantity !== undefined)
      patch.quantity = Math.max(1, Number(params.quantity));
    if (params.selected !== undefined) patch.selected = !!params.selected;
    await item.update(patch, { transaction: t });
    return item;
  });
}

export async function removeItem(ctx: CartCtx, cartItemId: number) {
  return await sequelize.transaction(async (t) => {
    const cart = await getOrCreateCart(ctx);
    const item = await CartItem.findOne({
      where: { id: cartItemId, cartId: cart.id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!item) throw new Error("CART_ITEM_NOT_FOUND");
    await item.destroy({ transaction: t });
    return true;
  });
}

export async function clearCart(ctx: CartCtx) {
  const cart = await getOrCreateCart(ctx);
  await CartItem.destroy({ where: { cartId: cart.id } });
  return true;
}

export async function toggleSelectAll(ctx: CartCtx, selected: boolean) {
  const cart = await getOrCreateCart(ctx);
  await CartItem.update({ selected }, { where: { cartId: cart.id } });
  return true;
}

export async function getCartDetail(ctx: CartCtx) {
  const cart = await getOrCreateCart(ctx);
  const items = await CartItem.findAll({
    where: { cartId: cart.id },
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["id", "name", "price", "thumbnailUrl"],
        include: [
          {
            model: ProductDiscount,
            as: "discount",
            attributes: ["isActive", "startsAt", "endsAt", "discountPercent"],
            required: false,
          },
        ],
      },
    ],
    order: [["id", "ASC"]],
  });

  let totalItems = 0;
  let totalQuantity = 0;

  const detailed = items.map((it) => {
    totalItems += 1;
    totalQuantity += it.quantity;
    return {
      id: it.id,
      productId: it.productId,
      name: (it as any).product?.name,
      thumbnailUrl: (it as any).product?.thumbnailUrl,
      price: Number((it as any).product?.price ?? 0), // hiển thị tham khảo; không checkout
      quantity: it.quantity,
      selected: it.selected,
    };
  });

  return { cartId: cart.id, totalItems, totalQuantity, items: detailed };
}

export async function getCartDetailWithDiscount(ctx: CartCtx) {
  const cart = await getOrCreateCart(ctx);
  const items = await CartItem.findAll({
    where: { cartId: cart.id },
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["id", "name", "price", "thumbnailUrl"],
        include: [
          {
            model: ProductDiscount,
            as: "discount",
            attributes: ["isActive", "startsAt", "endsAt", "discountPercent"],
            required: false,
          },
        ],
      },
    ],
    order: [["id", "ASC"]],
  });

  let totalItems = 0;
  let totalQuantity = 0;

  const detailed = items.map((it: any) => {
    totalItems += 1;
    totalQuantity += it.quantity;
    const p = it.product || {};
    const rawPrice = Number(p.price ?? 0);
    const d = p.discount || {};
    const now = new Date();
    const active =
      d && d.isActive === true &&
      (!d.startsAt || new Date(d.startsAt) <= now) &&
      (!d.endsAt || new Date(d.endsAt) >= now) &&
      Number(d.discountPercent) > 0;
    const discountPercent = active ? Number(d.discountPercent) : 0;
    const finalPrice = active ? Math.round((rawPrice * (1 - discountPercent / 100)) * 100) / 100 : rawPrice;
    return {
      id: it.id,
      productId: it.productId,
      name: p.name,
      thumbnailUrl: p.thumbnailUrl,
      price: Number(finalPrice),
      quantity: it.quantity,
      selected: it.selected,
    };
  });

  return { cartId: cart.id, totalItems, totalQuantity, items: detailed };
}

export async function mergeGuestCartToUser(userId: number, deviceId: string) {
  return await sequelize.transaction(async (t) => {
    // giỏ đích
    let userCart = await getOrCreateCart({ userId });
    // giỏ nguồn (guest)
    const guestCart = (await Cart.findOne({
      where: { deviceId },
      include: [{ model: CartItem, as: "items" }],
      transaction: t,
      lock: t.LOCK.UPDATE,
    })) as CartWithItems | null;

    if (!guestCart || !guestCart.items?.length) return userCart;

    for (const item of guestCart.items) {
      const exist = await CartItem.findOne({
        where: { cartId: userCart.id, productId: item.productId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (exist) {
        await exist.update(
          { quantity: exist.quantity + item.quantity },
          { transaction: t }
        );
      } else {
        await CartItem.create(
          {
            cartId: userCart.id,
            productId: item.productId,
            quantity: item.quantity,
            selected: item.selected,
          },
          { transaction: t }
        );
      }
    }

    // dọn giỏ guest
    await CartItem.destroy({ where: { cartId: guestCart.id }, transaction: t });
    await guestCart.destroy({ transaction: t });

    return userCart;
  });
}
