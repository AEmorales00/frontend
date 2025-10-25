import type { Role, UserStatus } from './auth.models';
export type { Role, UserStatus };

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  roles: Role[];
  createdAt?: string;
}

export interface CreateUserDto {
  name: string; email: string; password: string;
  roles: Role[]; status: UserStatus;
}
export interface UpdateUserDto { name?: string; email?: string; }

