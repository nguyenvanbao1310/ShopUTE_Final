import axios, { AxiosHeaders } from "axios";

// Base URL — backend user hoặc admin, tuỳ theo bạn muốn gọi API nào
export const USER_BASE_URL =
  process.env.USER_API_BASE || "http://localhost:8088/api";

// Hàm lấy token từ localStorage (nếu có)
function getToken(): string | undefined {
  try {
    const t =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      undefined;
    return typeof t === "string" && t.trim() ? t : undefined;
  } catch {
    return undefined;
  }
}

// Khởi tạo axios instance
export const productApi = axios.create({
  baseURL: USER_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Interceptor để tự động thêm Authorization token
productApi.interceptors.request.use((config) => {
  const headers = config.headers as AxiosHeaders;
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return config;
});

// ===============================
// 🔹 Types
// ===============================

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  finalPrice: number;
  discountPercent: number;
  stock: number;
  thumbnailUrl: string;
  averageRating: number;
  Category?: { id: number; name: string };
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ProductResponse {
  products: Product[];
  pagination: PaginationInfo;
}

// ===============================
// 🔹 API functions
// ===============================

// Lấy toàn bộ sản phẩm (có hỗ trợ lọc brand, page)
export async function fetchAllProducts(
  page: number = 1,
  limit: number = 12,
  brands?: string[]
): Promise<ProductResponse> {
  const brandQuery = brands?.length ? `&brand=${brands.join(",")}` : "";
  const { data } = await productApi.get(
    `/products/all?page=${page}&limit=${limit}${brandQuery}`
  );
  return data;
}

// Lấy sản phẩm theo 1 danh mục
export async function fetchProductsByCategory(
  categoryName: string,
  page: number = 1,
  limit: number = 12,
  brands?: string[]
): Promise<ProductResponse> {
  const brandQuery = brands?.length ? `&brand=${brands.join(",")}` : "";
  const { data } = await productApi.get(
    `/products/category/${categoryName}?page=${page}&limit=${limit}${brandQuery}`
  );
  return data;
}

// ✅ Lấy sản phẩm theo nhiều danh mục
export async function fetchProductsByCategories(
  categoryNames: string[],
  page: number = 1,
  limit: number = 12,
  brands?: string[]
): Promise<ProductResponse> {
  const namesQuery = categoryNames.join(",");
  const brandQuery = brands?.length ? `&brand=${brands.join(",")}` : "";
  const { data } = await productApi.get(
    `/products/categories?names=${namesQuery}&page=${page}&limit=${limit}${brandQuery}`
  );
  return data;
}

// Lấy chi tiết sản phẩm
export async function fetchProductDetail(id: number): Promise<Product> {
  const { data } = await productApi.get(`/products/${id}`);
  return data;
}

// Lấy sản phẩm tương tự
export async function fetchSimilarProducts(
  productId: number,
  categoryId: number
): Promise<Product[]> {
  const { data } = await productApi.get(
    `/products/${productId}/similar?categoryId=${categoryId}`
  );
  return data;
}

// ===============================
// 🔹 CRUD (nếu bạn dùng cho admin)
// ===============================

// Tạo sản phẩm mới
export async function createProduct(payload: Partial<Product>): Promise<Product> {
  const { data } = await productApi.post(`/products`, payload);
  return data;
}

// Cập nhật sản phẩm
export async function updateProduct(
  id: number,
  payload: Partial<Product>
): Promise<Product> {
  const { data } = await productApi.put(`/products/${id}`, payload);
  return data;
}
// Lấy toàn bộ thương hiệu
export async function fetchAllBrands(): Promise<string[]> {
  const { data } = await productApi.get("/products/brands");
  return data; // Backend trả ra mảng string
}
// 🔍 Tìm kiếm sản phẩm theo keyword và categoryName
export async function searchProductsApi(keyword: string, categoryName?: string): Promise<Product[]> {
  const query = new URLSearchParams();
  if (keyword) query.append("keyword", keyword);
  if (categoryName) query.append("categoryName", categoryName);

  const { data } = await productApi.get(`/products/search?${query.toString()}`);
  return data;
}
