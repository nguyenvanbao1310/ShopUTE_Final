export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: boolean | null;
  birthday?: Date | null;
  avatar_url?: string | null;
  loyaltyPoints?: number;
}