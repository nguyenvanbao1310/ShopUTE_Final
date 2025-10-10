import { Transaction } from "sequelize";
import sequelize from "../config/configdb";
import Order from "../models/Order";
import OrderDetail from "../models/OrderDetail";
import Product from "../models/Product";
import User from "../models/User";
import type { OrderCreationAttributes } from "../models/Order";
import type { OrderDetailCreationAttributes } from "../models/OrderDetail";
import { OrderStatus, PaymentStatus } from "../types/order";
import CancelRequest from "../models/CancelRequest";
import Voucher from "../models/Voucher";
import ShippingMethod from "../models/ShippingMethod";

export interface CreateOrderInput {
  userId?: number;
  code: string;
  paymentMethod?: string | null;
  note?: string | null;
  deliveryAddress?: string | null;
  voucherId?: number | null;
  shippingMethodId: number;
  usedPoints?: number;
  items: {
    productId: number;
    quantity: number;
    price: number; 
  }[];
}


export interface CancelResult {
  type: "cancelled" | "request";
  order?: Order;
  message?: string;
}

export async function createOrder(data: CreateOrderInput) {
  const t = await sequelize.transaction();
  try {
    // 1. Tính subtotal
    const subtotal = data.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    // 2. Tính phí ship
    let shippingFee = 0;
    if (data.shippingMethodId) {
      const shipping = await ShippingMethod.findByPk(data.shippingMethodId);
      if (shipping) {
        shippingFee = Number(shipping.fee);
      }
    }
    // 3. Tính giảm giá voucher
    let discountAmount = 0;
    if (data.voucherId) {
      const voucher = await Voucher.findByPk(data.voucherId);
      if (voucher) {
        if (voucher.discountType === "PERCENT") {
          discountAmount = (subtotal * Number(voucher.discountValue)) / 100;
        } else {
          discountAmount = Number(voucher.discountValue);
        }
      }
    }
    // 4. Tính giảm giá từ điểm thưởng
    const usedPoints = data.usedPoints ?? 0;
    const pointsDiscountAmount = usedPoints * 1000; // 1 điểm = 1000đ

    // 5. Tính final total
    const finalAmount =
      subtotal + shippingFee - discountAmount - pointsDiscountAmount;

    // 6. Tạo order
    const order = await Order.create(
      {
        userId: data.userId ?? null,
        code: data.code,
        totalAmount: subtotal.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        shippingFee: shippingFee.toFixed(2),
        finalAmount: finalAmount.toFixed(2),
        usedPoints,
        pointsDiscountAmount: pointsDiscountAmount.toFixed(2),
        voucherId: data.voucherId ?? null,
        shippingMethodId: data.shippingMethodId,
        status: "PENDING",
        paymentMethod: data.paymentMethod ?? "COD",
        paymentStatus: "UNPAID",
        note: data.note ?? null,
        deliveryAddress: data.deliveryAddress ?? null,
      },
      { transaction: t }
    );
    // 7. Tạo order details (theo đúng model của bạn)
    const details = data.items.map((i) => ({
      orderId: order.id,
      productId: i.productId,
      quantity: i.quantity,
      subtotal: (i.price * i.quantity).toFixed(2),
    }));

    await OrderDetail.bulkCreate(details, { transaction: t });

    // if (data.userId && usedPoints > 0) {
    //   const user = await User.findByPk(data.userId, { transaction: t });
    //   if (user) {
    //     if ((user.loyaltyPoints ?? 0) < usedPoints) {
    //       throw new Error("Không đủ điểm thưởng để sử dụng");
    //     }
    //     user.loyaltyPoints = (user.loyaltyPoints ?? 0) - usedPoints;
    //     await user.save({ transaction: t });
    //   }
    // }
    await t.commit();
    return { order, details };
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

export async function payOrderCOD(orderId: number) {
  const t = await sequelize.transaction();
  try {
    const order = await Order.findByPk(orderId, { transaction: t });
    if (!order) {
      throw new Error("Order can't found ");
    }
    if (order.paymentMethod !== "COD") {
      throw new Error("Payment method isn't COD");
    }
    if (order.paymentStatus === "PAID") {
      throw new Error("Order already paid");
    }
    if (order.status === "CANCELLED") {
      throw new Error("Order has been cancelled");
    }
    order.paymentStatus = "PAID";
    order.status = "COMPLETED";
    await order.save({ transaction: t });
    await t.commit();
    return order;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

export async function confirmOrder(orderId: number) {
  const t = await sequelize.transaction();
  try {
    const order = await Order.findByPk(orderId, { transaction: t });
    if (!order) {
      throw new Error("Order could't find");
    }
    if (order.status === OrderStatus.CONFIRMED) {
      throw new Error("Order has been confirmed");
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new Error(`Cannot confirm order in status: ${order.status}`);
    }
    order.status = OrderStatus.CONFIRMED;
    await order.save({ transaction: t });
    await t.commit();
    return order;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}
export async function shipOrder(orderId: number) {
  const t = await sequelize.transaction();
  try {
    const order = await Order.findByPk(orderId, { transaction: t });
    if (!order) throw new Error("Order not found");

    if (order.status !== OrderStatus.CONFIRMED) {
      throw new Error(
        `Only confirmed orders can be shipped. Current: ${order.status}`
      );
    }

    order.status = OrderStatus.SHIPPED;
    await order.save({ transaction: t });

    await t.commit();
    return order;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

export async function cancelPendingOrder(
  orderId: number
): Promise<CancelResult> {
  const t: Transaction = await sequelize.transaction();
  try {
    const order = await Order.findByPk(orderId, { transaction: t });
    if (!order) throw new Error("Order not found");

    if (order.status !== OrderStatus.PENDING) {
      throw new Error(`Cannot cancel order in status: ${order.status}`);
    }

    order.status = OrderStatus.CANCELLED;
    if (order.paymentStatus === PaymentStatus.PAID) {
      order.paymentStatus = PaymentStatus.REFUNDED;
    }

    await order.save({ transaction: t });
    await t.commit();

    return { type: "cancelled", order };
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

export async function requestCancelOrder(
  orderId: number,
  userId?: number,
  reason?: string
): Promise<CancelResult> {
  const t: Transaction = await sequelize.transaction();
  try {
    const order = await Order.findByPk(orderId, { transaction: t });
    if (!order) throw new Error("Order not found");

    if (order.status !== OrderStatus.CONFIRMED) {
      throw new Error(
        `Cannot request cancel for order in status: ${order.status}`
      );
    }

    await CancelRequest.create(
      {
        orderId: order.id,
        userId: userId ?? null,
        reason: reason ?? "No reason provided",
        status: "PENDING",
      },
      { transaction: t }
    );

    order.status = OrderStatus.CANCEL_REQUESTED;
    await order.save({ transaction: t });

    await t.commit();
    return { type: "request", message: "Cancel request sent to shop" };
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
export async function getUserOrders(userId: number) {
  const orders = await Order.findAll({
    where: { userId },
    include: [
      {
        model: OrderDetail,
        as: "OrderDetails", // ✅ phải đúng alias đã khai báo
        include: [
          {
            model: Product,
            as: "Product", // alias đúng trong association
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return orders;
}
