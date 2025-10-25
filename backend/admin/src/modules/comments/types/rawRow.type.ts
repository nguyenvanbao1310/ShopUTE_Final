type RawRow = {
  id: number;
  productId: number;
  productName: string | null;
  userId: number | null;
  userEmail?: string | null;
  userActive: 0 | 1 | boolean;
  rating: string | number;
  comment: string | null;
  containsProfanity: 0 | 1 | boolean;
  createdAt: Date | string;
  userName: string;
};

export type { RawRow };
