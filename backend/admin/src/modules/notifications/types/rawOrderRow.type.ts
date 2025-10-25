type RawOrderRow = {
  orderId: number;
  customerId: number | null;
  code: string | null;
  status: 'PENDING' | 'CANCEL_REQUESTED';
  createdAt: Date;
  firstName: string | null;
  lastName: string | null;
};

export type { RawOrderRow };