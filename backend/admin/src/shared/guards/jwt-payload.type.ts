export interface JwtUserPayload {
  sub: number;          // user ID
  email?: string;
  role?: string;        // 'ADMIN' | 'USER'
  iat?: number;
  exp?: number;
}
