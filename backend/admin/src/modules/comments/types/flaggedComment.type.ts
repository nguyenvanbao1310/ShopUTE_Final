type FlaggedComment = {
  id: number;
  productId: number;
  productName: string;
  userId: number | null;
  userName: string;
  userEmail: string | null;
  userActive: boolean;
  rating: number;
  comment: string | null;
  containsProfanity: boolean;
  createdAt: Date;
  reason: string;
};

export type { FlaggedComment };
