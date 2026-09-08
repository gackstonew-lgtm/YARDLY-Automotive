import { UserRole, SellerType } from '../../types/database';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  seller_type?: SellerType;
  business_name?: string;
  avatar_url?: string;
}

let activeUserCache: AuthUser | null = null;

export function getCachedUser(): AuthUser | null {
  return activeUserCache;
}

export function setCachedUser(user: AuthUser | null): void {
  activeUserCache = user;
}

export function clearCachedUser(): void {
  activeUserCache = null;
}
