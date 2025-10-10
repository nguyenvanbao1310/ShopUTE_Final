import Wishlist from "../models/Wishlist";
import Product from "../models/Product";

interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  Product: {
    id: number;
    name: string;
    price: string;
    brand?: string;
    stock?: number;
    thumbnailUrl: string;
  };
}

// Lấy wishlist của user
export const getWishlistByUser = async (
  userId: number
): Promise<WishlistItem[]> => {
  const wishlist = await Wishlist.findAll({
    where: { userId },
    include: [
      {
        model: Product,
        as: "Product",
        attributes: ["id", "name", "price", "brand", "stock", "thumbnailUrl"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return wishlist.map((w: any) => ({
    id: w.id,
    userId: w.userId,
    productId: w.productId,
    Product: w.Product,
  }));
};

// Thêm sản phẩm vào wishlist
export const addProductToWishlist = async (
  userId: number,
  productId: number
) => {
  // Kiểm tra tồn tại
  const exist = await Wishlist.findOne({ where: { userId, productId } });
  if (exist) throw new Error("Product already in wishlist");

  return await Wishlist.create({ userId, productId });
};

// Xoá sản phẩm khỏi wishlist
export const removeProductFromWishlist = async (
  userId: number,
  productId: number
) => {
  const deleted = await Wishlist.destroy({ where: { userId, productId } });
  if (!deleted) throw new Error("Product not found in wishlist");
  return deleted;
};
