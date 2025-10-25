import apiClient from "./api";

export type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  viewCount: number;
  stock: number;
  status: "ACTIVE" | "INACTIVE";
  thumbnailUrl?: string;
  imageUrls?: string[];
  categoryId: number;
  brand: string;
  cpu: string;
  ram: string;
  storage: string;
  gpu: string;
  screen: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductImage = {
  id: number;
  productId: number;
  url: string;
  position?: number;
  createdAt: string;
  updatedAt: string;
};

export const productApi = {
  // Lấy tất cả sản phẩm
  async getAll(): Promise<Product[]> {
    const data = await apiClient.get<Product[]>("/products");
    return data.map((p) => ({ ...p, price: Number(p.price) }));
  },

  // Lấy sản phẩm theo id
  async getById(id: number): Promise<Product> {
    const data = await apiClient.get<Product>(`/products/${id}`);
    return { ...data, price: Number(data.price) };
  },

  async getImages(productId: number): Promise<ProductImage[]> {
    return apiClient.get<ProductImage[]>(`/product-images/${productId}`);
  },

  // Tạo mới sản phẩm
  async create(product: Omit<Product, "id" | "createdAt" | "updatedAt">) {
    return apiClient.post<Product>("/products", product);
  },

  // Cập nhật sản phẩm
  async update(id: number, product: Partial<Product>) {
    return apiClient.patch<Product>(`/products/${id}`, product);
  },

  // Xoá sản phẩm
  async remove(id: number) {
    return apiClient.delete(`/products/${id}`);
  },

  async deleteImage(imageId: number) {
    return apiClient.delete(`/product-images/${imageId}`);
  },
};
