import apiClient from "./api";

export type Category = {
  id: number;
  name: string;
  parentId?: number | null;
  createdAt: string;
  updatedAt: string;
};

export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    return apiClient.get<Category[]>("/categories");
  },
};
