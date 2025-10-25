type ReplyRow = {
  id: number;
  ratingId: number;
  adminUserId: number | null;
  adminName: string | null;
  message: string;
  createdAt: Date;
};
export type { ReplyRow };