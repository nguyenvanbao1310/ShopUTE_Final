import { Request, Response } from "express";
import {
  getNewestProductsSvc,
  getBestSellersSvc,
  getMostViewedSvc,
  getTopDiscountSvc,
  getProductDetailSvc,
  getAllProductsSvc,
  createProductSvc,
  updateProductSvc,
  getProductsByCategoryNameSvc,
  getSimilarProductsSvc ,
} from "../services/productService";
import { AuthRequest } from "../middleware/auth";

//sản phẩm mới nhất
export async function newestProducts(_req: AuthRequest, res: Response) {
  try {
    const data = await getNewestProductsSvc(8);
    res.json(data);
  } catch (e: any) {
    res.status(e?.status || 500).json({ message: e?.message || "Internal Server Error" });
  }
}

// bán chạy nhất
export async function bestSellers(_req: AuthRequest, res: Response) {
  try {
    const data = await getBestSellersSvc(6);
    res.json(data);
  } catch (e: any) {
    res.status(e?.status || 500).json({ message: e?.message || "Internal Server Error" });
  }
}

//nhiều lượt xem nhất
export async function mostViewed(_req: AuthRequest, res: Response) {
  try {
    const data = await getMostViewedSvc(8);
    res.json(data);
  } catch (e: any) {
    res.status(e?.status || 500).json({ message: e?.message || "Internal Server Error" });
  }
}
//giảm giá nhiều nhất
export async function topDiscount(_req: AuthRequest, res: Response) {
  try {
    const data = await getTopDiscountSvc(4);
    res.json(data);
  } catch (e: any) {
    res.status(e?.status || 500).json({ message: e?.message || "Internal Server Error" });
  }
}

// chi tiết – tự tăng view
export async function getProductDetail(req: AuthRequest, res: Response) {
  try {
    const idNum = Number(req.params.id);
    const data = await getProductDetailSvc(idNum);
    res.json(data);
  } catch (e: any) {
    res.status(e?.status || 500).json({ message: e?.message || "Internal Server Error" });
  }
}

// lấy toàn bộ sản phẩm
export async function getAllProducts(req: AuthRequest, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const brandsQuery = req.query.brand as string;
    const brands = brandsQuery ? brandsQuery.split(",") : undefined;

    const data = await getAllProductsSvc(page, limit, brands);
    res.json(data);
  } catch (e: any) {
    res.status(e?.status || 500).json({
      message: e?.message || "Internal Server Error",
    });
  }
}


export async function createProduct(req: AuthRequest, res: Response) {
  try {
    const data = await createProductSvc(req.body);
    res.status(201).json(data);
  } catch (e: any) {
    res
      .status(e?.status || 500)
      .json({ message: e?.message || "Internal Server Error" });
  }
}

export async function updateProduct(req: AuthRequest, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    const data = await updateProductSvc(id, req.body);
    res.json(data);
  } catch (e: any) {
    res
      .status(e?.status || 500)
      .json({ message: e?.message || "Internal Server Error" });
  }
}

// Lấy sản phẩm theo danh mục (case-insensitive)
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryName } = req.params;
    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const brandQuery = req.query.brand as string;
    const brands = brandQuery ? brandQuery.split(",").map((b) => b.trim()) : undefined;

    console.log("CategoryName in controller:", categoryName); // Log để kiểm tra
    console.log("BrandQuery received:", brandQuery); // Log để kiểm tra brand query
    console.log("Brands processed:", brands); // Log để kiểm tra brands

    const { products, pagination } = await getProductsByCategoryNameSvc(categoryName, page, limit, brands);

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found in this category" });
    }

    res.json({ products, pagination });
  } catch (error) {
    console.error("Error in getProductsByCategory:", error);
    res.status(500).json({
      message: "Error fetching products",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
export async function getSimilarProducts(req: Request, res: Response) {
  try {
    const productId = Number(req.params.id);
    const categoryId = Number(req.query.categoryId); // truyền categoryId từ FE
    if (Number.isNaN(productId) || Number.isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid productId or categoryId" });
    }

    const products = await getSimilarProductsSvc(productId, categoryId);
    res.json(products);
  } catch (e: any) {
    res.status(e?.status || 500).json({
      message: e?.message || "Internal Server Error",
    });
  }
}