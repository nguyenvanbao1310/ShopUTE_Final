// services/productService.ts
import {
  Transaction,
  col,
  fn,
  Op,
  literal,
  type Includeable,
  WhereOptions,
} from "sequelize";
import sequelize from "../config/configdb";

import ProductModel from "../models/Product";
import CategoryModel from "../models/Category";
import OrderDetailModel from "../models/OrderDetail";
import ProductDiscountModel from "../models/ProductDiscount";
import ProductImageModel from "../models/ProductImage";
import RatingModel from "../models/rating";


const Product = ProductModel as any;
const Category = CategoryModel as any;
const OrderDetail = OrderDetailModel as any;
const ProductDiscount = ProductDiscountModel as any;
const ProductImage = ProductImageModel as any;
const Rating = RatingModel as any;

// Định nghĩa type cho Product (dựa trên ProductAttributes từ mô hình)
interface ProductAttributes {
  id: number;
  name: string;
  brand: string;
  price: number;
  status: "ACTIVE" | "INACTIVE";
  stock: number;
  viewCount: number;
  thumbnailUrl: string | null;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
  cpu?: string | null;
  ram?: string | null;
  storage?: string | null;
  gpu?: string | null;
  screen?: string | null;
  description?: string | null;
}
// ===== Common attributes (alias rõ) =====
const baseAttrs = [
  "id",
  "name",
  "brand",
  "price",
  "status",
  "stock",
  "viewCount",
  "thumbnailUrl",
  "categoryId",
  "createdAt",
  "updatedAt",

  // finalPrice & discountPercent chỉ hiển thị khi có giảm giá còn hiệu lực
  [
    literal(`CASE
      WHEN \`discount\`.\`isActive\` = 1 AND (\`discount\`.\`startsAt\` <= NOW() OR \`discount\`.\`startsAt\` IS NULL) AND (\`discount\`.\`endsAt\` >= NOW() OR \`discount\`.\`endsAt\` IS NULL)
      THEN ROUND(\`Product\`.\`price\` * (1 - \`discount\`.\`discountPercent\` / 100), 2)
      ELSE \`Product\`.\`price\`
    END`),
    "finalPrice",
  ],
  [
    literal(`CASE
      WHEN \`discount\`.\`isActive\` = 1 AND (\`discount\`.\`startsAt\` <= NOW() OR \`discount\`.\`startsAt\` IS NULL) AND (\`discount\`.\`endsAt\` >= NOW() OR \`discount\`.\`endsAt\` IS NULL)
      THEN \`discount\`.\`discountPercent\`
      ELSE 0
    END`),
    "discountPercent",
  ],
];

function buildIncludeCommon(): Includeable[] {
  return [
    {
      model: Category,
      as: "Category",
      attributes: ["id", "name", "parentId"],
      required: false,
    },
    {
      model: ProductDiscount,
      as: "discount",
      attributes: ["isActive", "startsAt", "endsAt", "discountPercent"], // Đảm bảo các cột cần thiết
      required: false,
    },
    {
      model: ProductImage,
      as: "Images",
      attributes: ["id", "url", "position", "createdAt", "updatedAt"],
      required: false,
      separate: true,
      order: [["position", "ASC"]],
    },
  ];
}

// ===== DTOs =====
export type ProductPayload = {
  name: string;
  price: string;
  stock: number;
  status: "ACTIVE" | "INACTIVE";
  categoryId: number;
  brand: string;
  cpu: string;
  ram: string;
  storage: string;
  gpu: string;
  screen: string;
  description?: string | null;
  thumbnailUrl?: string | null;

  discount?: {
    discountPercent: string;
    startsAt?: string | null;
    endsAt?: string | null;
    isActive?: boolean;
  };
};

// ===== CREATE / UPDATE =====
const validateCategory = async (categoryId: number) => {
  const cat = await Category.findByPk(categoryId);
  if (!cat) {
    const err: any = new Error("Category not found");
    err.status = 400;
    throw err;
  }
};

export async function createProductSvc(payload: ProductPayload) {
  if (payload.categoryId) {
    await validateCategory(payload.categoryId);
  }

  return sequelize.transaction(async (t: Transaction) => {
    const { discount, ...body } = payload;
    const created = await Product.create({ ...body, viewCount: 0 }, { transaction: t });

    if (discount) {
      await ProductDiscount.upsert(
        {
          productId: created.id,
          discountPercent: discount.discountPercent,
          startsAt: discount.startsAt ?? null,
          endsAt: discount.endsAt ?? null,
          isActive: discount.isActive ?? true,
        },
        { transaction: t }
      );
    }
    return created;
  });
}

export async function updateProductSvc(id: number, payload: Partial<ProductPayload>) {
  const product = await Product.findByPk(id);
  if (!product) {
    const err: any = new Error("Product not found");
    err.status = 404;
    throw err;
  }

  if (payload.categoryId) {
    await validateCategory(payload.categoryId);
  }

  return sequelize.transaction(async (t: Transaction) => {
    const { discount, ...body } = payload;
    if (Object.keys(body).length) {
      await product.update(body, { transaction: t });
    }

    if (discount) {
      await ProductDiscount.upsert(
        {
          productId: id,
          discountPercent: discount.discountPercent,
          startsAt: discount.startsAt ?? null,
          endsAt: discount.endsAt ?? null,
          isActive: discount.isActive ?? true,
        },
        { transaction: t }
      );
    }
    return product;
  });
}

// ===== LISTS =====
export async function getNewestProductsSvc(limit = 8) {
  return Product.findAll({
    where: { status: "ACTIVE" },
    attributes: baseAttrs,
    include: buildIncludeCommon(),
    order: [["createdAt", "DESC"]],
    limit,
    subQuery: false,
  });
}

export async function getBestSellersSvc(limit = 6) {
  return Product.findAll({
    where: { status: "ACTIVE" },
    attributes: [
      ...baseAttrs,
      [fn("COALESCE", fn("SUM", col("OrderDetails.quantity")), 0), "sold"],
    ],
    include: [
      ...buildIncludeCommon(),
      {
        model: OrderDetail,
        as: "OrderDetails",
        attributes: [],
        required: false,
      },
    ],
    group: baseAttrs.map((attr) => (Array.isArray(attr) ? attr[0] : attr)),
    order: [[literal("sold"), "DESC"]],
    limit,
    subQuery: false,
  });
}

export async function getMostViewedSvc(limit = 8) {
  return Product.findAll({
    where: { status: "ACTIVE" },
    attributes: baseAttrs,
    include: buildIncludeCommon(),
    order: [["viewCount", "DESC"], ["createdAt", "DESC"]],
    limit,
  });
}

export async function getTopDiscountSvc(limit = 4) {
  return Product.findAll({
    where: { status: "ACTIVE" },
    attributes: baseAttrs,
    include: [
      {
        model: ProductDiscount,
        as: "discount",
        attributes: [],
        required: true,
        where: { isActive: true },
      },
      {
        model: Category,
        as: "Category",
        attributes: ["id", "name", "parentId"],
        required: false,
      },
    ],
    order: [[col("discount.discountPercent"), "DESC"], ["createdAt", "DESC"]],
    limit,
    subQuery: false,
  });
}

// ===== DETAIL / ALL =====
export async function getProductDetailSvc(id: number) {
  await Product.increment("viewCount", { by: 1, where: { id } });

  const found = await Product.findByPk(id, {
    attributes: [
      ...baseAttrs,
      "description",
      "cpu",
      "ram",
      "storage",
      "gpu",
      "screen",
       [fn("COUNT", fn("DISTINCT", col("OrderDetails.id"))), "buyerCount"],
    [fn("COUNT", fn("DISTINCT", col("Ratings.id"))), "commentCount"],
    ],
    include: [
      ...buildIncludeCommon(),
      {
        model: OrderDetail,
        as: "OrderDetails",
        attributes: [],
        required: false,
      },
      {
        model: Rating,
        as: "Ratings",
        attributes: [],
        required: false,
      },
    ],
    group: ["Product.id"],
  });

  if (!found) {
    const err: any = new Error("Product not found");
    err.status = 404;
    throw err;
  }
  return found;
}

export async function getSimilarProductsSvc(productId: number, categoryId: number, limit = 4) {
  return Product.findAll({
    where: {
      status: "ACTIVE",
      categoryId, // cùng danh mục
      id: { [Op.ne]: productId }, // loại bỏ sản phẩm hiện tại
    },
    attributes: baseAttrs,
    include: buildIncludeCommon(),
    order: [["createdAt", "DESC"]],
    limit,
    subQuery: false,
  });
}
export async function getAllProductsSvc(
  page: number = 1,
  limit: number = 12,
  brands?: string[]
) {
  const offset = (page - 1) * limit;

  let productWhere: WhereOptions = { status: "ACTIVE" };
  if (brands && brands.length > 0) {
    productWhere = {
      ...productWhere,
      brand: {
        [Op.in]: brands,
      },
    };
  }

  const result = await Product.findAndCountAll({
    where: productWhere,
    attributes: baseAttrs,
    include: buildIncludeCommon(),
    order: [["createdAt", "DESC"]],
    limit,
    offset,
    distinct: true,
    subQuery: false,
  });

  const totalProducts = result.count.length || result.count;
  const totalPages = Math.ceil(totalProducts / limit);
  const products = result.rows.map((row: any) => ({
    ...row.toJSON(),
    price: parseFloat(row.getDataValue("price")),
    finalPrice:
      row.getDataValue("finalPrice") !== undefined
        ? parseFloat(row.getDataValue("finalPrice"))
        : parseFloat(row.getDataValue("price")),
    discountPercent:
      row.getDataValue("discountPercent") !== undefined
        ? parseFloat(row.getDataValue("discountPercent"))
        : 0,
    averageRating: 0,
  }));

  return {
    products,
    pagination: {
      currentPage: page,
      totalPages,
      totalProducts,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
export async function getProductsByCategoryNameSvc(
  categoryName: string,
  page: number = 1,
  limit: number = 12,
  brands?: string[]
) {
  console.log("CategoryName received:", categoryName); // Log để kiểm tra categoryName
  console.log("Brands received:", brands); // Log để kiểm tra brands

  const offset = (page - 1) * limit;
  let categoryWhere: WhereOptions = {};
  let productWhere: WhereOptions = { status: "ACTIVE" };

  // Lọc theo danh mục, sử dụng LOWER để không phân biệt hoa/thường
  if (categoryName.toLowerCase() !== "all") {
    categoryWhere = {
      name: {
        [Op.like]: `%${categoryName.toLowerCase()}%`, // Sử dụng Op.like
      },
    };
  }

  // Lọc theo thương hiệu, giống getAllProductsSvc
  if (brands && brands.length > 0) {
    productWhere = {
      ...productWhere,
      brand: {
        [Op.in]: brands.map(b => b.trim()), // Loại bỏ khoảng trắng
      },
    };
  }

  console.log("Category Where condition:", categoryWhere); // Log để kiểm tra categoryWhere
  console.log("Product Where condition:", productWhere); // Log để kiểm tra productWhere

  const result = await Product.findAndCountAll({
    where: productWhere,
    include: [
      {
        model: Category,
        as: "Category",
        attributes: ["id", "name", "parentId"],
        where: categoryWhere,
        required: categoryName.toLowerCase() !== "all",
      },
      {
        model: ProductDiscount,
        as: "discount",
        attributes: ["isActive", "startsAt", "endsAt", "discountPercent"],
        required: false,
      },
      {
        model: ProductImage,
        as: "Images",
        attributes: ["id", "url", "position", "createdAt", "updatedAt"],
        required: false,
        separate: true,
        order: [["position", "ASC"]],
      },
      {
        model: Rating,
        as: "Ratings",
        attributes: [],
        required: false,
      },
    ],
    attributes: {
      include: [
        [fn("COALESCE", fn("AVG", col("Ratings.rating")), 0), "averageRating"],
        ...baseAttrs,
      ],
    },
    group: ['Product.id'], // Thêm GROUP BY để khắc phục lỗi aggregate
    order: [["createdAt", "DESC"]],
    limit,
    offset,
    distinct: true,
    subQuery: false,
  });

  const totalProducts = result.count.length || result.count;
  const totalPages = Math.ceil(totalProducts / limit);
  const products = result.rows.map((row: any) => ({
    ...row.toJSON(),
    price: parseFloat(row.getDataValue("price")),
    finalPrice:
      row.getDataValue("finalPrice") !== undefined
        ? parseFloat(row.getDataValue("finalPrice"))
        : parseFloat(row.getDataValue("price")),
    discountPercent:
      row.getDataValue("discountPercent") !== undefined
        ? parseFloat(row.getDataValue("discountPercent"))
        : 0,
    averageRating: parseFloat(row.getDataValue("averageRating")) || 0,
  }));

  console.log("Products returned:", products.length); // Log số lượng sản phẩm
  console.log("Sample products:", products.slice(0, 2)); // Log mẫu sản phẩm

  return {
    products,
    pagination: {
      currentPage: page,
      totalPages,
      totalProducts,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

