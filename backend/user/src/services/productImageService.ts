import { FindAttributeOptions, Includeable } from "sequelize";
import * as ProductModel from "../models/Product";
import * as ProductImageModel from "../models/ProductImage";

const Product: any = (ProductModel as any).default || (ProductModel as any).Product;
const ProductImage: any = (ProductImageModel as any).default || (ProductImageModel as any).ProductImage;

export type ProductImagePayload = {
  productId: number;
  url: string;
  position?: number;
};

const baseAttrs: FindAttributeOptions = ["id", "productId", "url", "position", "createdAt", "updatedAt"];

function buildInclude(): Includeable[] {
  return [
    {
      model: Product,
      as: "product",
      attributes: ["id", "name", "brand", "price", "thumbnailUrl"],
      required: false,
    },
  ];
}

export async function createProductImageSvc(payload: ProductImagePayload) {
  const product = await Product.findByPk(payload.productId);
  if (!product) {
    const err: any = new Error("Product not found");
    err.status = 400;
    throw err;
  }
  return ProductImage.create({
    productId: payload.productId,
    url: payload.url,
    position: payload.position ?? 0,
  });
}

export async function updateProductImageSvc(id: number, payload: Partial<ProductImagePayload>) {
  const image = await ProductImage.findByPk(id);
  if (!image) {
    const err: any = new Error("ProductImage not found");
    err.status = 404;
    throw err;
  }

  if (payload.productId) {
    const product = await Product.findByPk(payload.productId);
    if (!product) {
      const err: any = new Error("Product not found");
      err.status = 400;
      throw err;
    }
  }

  await image.update(payload);
  return image;
}

export async function getAllProductImagesSvc() {
  return ProductImage.findAll({
    attributes: baseAttrs,
    include: buildInclude(),
    order: [["position", "ASC"], ["createdAt", "DESC"]],
  });
}
