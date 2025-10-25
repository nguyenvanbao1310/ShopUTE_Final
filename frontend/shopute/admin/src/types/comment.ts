export type AdminComment = {
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
  createdAt: string | Date;
  reason: string;
};

