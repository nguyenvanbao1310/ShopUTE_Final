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
  getAll: async (page = 1, limit = 7, search = "", sortBy = "Newest") => {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      search,
      sortBy,
    });

    return apiClient.get<{
      data: Product[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/products?${query.toString()}`);
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

  // Xuất danh sách sản phẩm ra file CSV
  // Xuất danh sách sản phẩm ra file CSV
  async exportCSV() {
    const blob = await apiClient.getBlob("/products/export/csv");

    // ✅ Tạo link tải file
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "products.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
