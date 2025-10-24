type FlaggedComment = {
  id: number;
  productId: number;
  productName: string;
  userId: number | null;
  userName: string;
  userActive: boolean;
  rating: number;
  comment: string | null;
  containsProfanity: boolean;
  createdAt: Date;
  reason: string;
};

export type { FlaggedComment };