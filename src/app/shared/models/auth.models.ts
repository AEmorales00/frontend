export type Role = 'ADMIN' | 'JEFE' | 'BODEGUERO' | 'VENDEDOR';
export type UserStatus = 'ACTIVO' | 'BLOQUEADO' | 'BAJA';

export interface JwtUserPayload {
  sub: number;
  name: string;
  email: string;
  status: UserStatus;
  roles: Role[];
  exp?: number;
}

export interface LoginResponse {
  token: string;
  user: JwtUserPayload;
}

