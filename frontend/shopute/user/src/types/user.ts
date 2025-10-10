export interface Profile {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  avatar_url?: string | null; 
  gender?: boolean | null;    
  birthday?: string | null;
  loyaltyPoints?: number | null;   
}