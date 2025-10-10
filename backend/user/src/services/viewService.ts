import ViewedProduct from "../models/ViewedProduct";
import Product from "../models/Product";

interface ViewedProductItem {
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

// Service: lấy danh sách viewed products của user
export const getViewedProductsByUser = async (
  userId: number
): Promise<ViewedProductItem[]> => {
  const items = await ViewedProduct.findAll({
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

  return items.map((w) => ({
    id: w.getDataValue("id"),
    userId: w.getDataValue("userId"),
    productId: w.getDataValue("productId"),
    Product: w.get("Product") as any, // hoặc ép kiểu theo Product interface
  }));
};

export const addRecentlyViewedProductByUser = async (
  userId: number,
  productId: number
) => {
  await ViewedProduct.destroy({ where: { userId, productId } });
  return await ViewedProduct.create({ userId, productId });
};

export const removeViewedProductByUser = async (
  userId: number,
  productId: number
) => {
  const deletedCount = await ViewedProduct.destroy({
    where: { userId, productId },
  });
  return deletedCount; // trả về số bản ghi đã xóa
};
