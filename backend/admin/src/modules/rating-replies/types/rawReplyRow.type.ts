type RawReplyRow = {
  id: number;
  ratingId: number;
  adminUserId: number | null;
  message: string;
  createdAt: Date | string;
  adminName: string | null;
};
export type { RawReplyRow };