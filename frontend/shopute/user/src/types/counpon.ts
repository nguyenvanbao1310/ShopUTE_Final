export interface Coupon {
  id: number;
  code: string;
  type: "PERCENT" | "AMOUNT";        
  value: string;                     
  minOrderAmount?: string | null;    
  maxDiscountValue?: string | null;
  expiresAt: string;                 
  isUsed?: boolean;
}
