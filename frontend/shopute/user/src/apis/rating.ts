import api from "./base";

export type CreateRatingInput = {
  rating: number;
  comment?: string;
  rewardType?: "points" | "coupon";
};

export async function fetchProductRatings(productId: number) {
  const { data } = await api.get(`/products/${productId}/ratings`);
  return data as any[];
}

export async function createProductRating(productId: number, payload: CreateRatingInput) {
  const { data } = await api.post(`/products/${productId}/ratings`, payload);
  return data as { id: number; reward?: { type: string; points?: number; code?: string; percent?: number; expiresAt?: string } };
}

