import { UserRole } from '../../types/database';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 100,
  admin: 80,
  yard_admin: 70,
  staff: 50,
  dealer: 20,
  seller: 15,
  buyer: 10
};

/**
 * Checks whether a given role meets or exceeds a minimum required role in the hierarchy.
 */
export function hasRequiredRole(userRole?: UserRole | null, minimumRole?: UserRole): boolean {
  if (!userRole) return false;
  if (!minimumRole) return true;

  const userLevel = ROLE_HIERARCHY[userRole] ?? 0;
  const minLevel = ROLE_HIERARCHY[minimumRole] ?? 0;

  return userLevel >= minLevel;
}

/**
 * Checks whether a role is an elevated administrative role (admin, yard_admin, super_admin).
 */
export function isAdminRole(role?: UserRole | null): boolean {
  return role === 'admin' || role === 'yard_admin' || role === 'super_admin';
}

/**
 * Checks whether a role has internal staff privileges or higher.
 */
export function isStaffRole(role?: UserRole | null): boolean {
  return role === 'staff' || role === 'yard_admin' || role === 'admin' || role === 'super_admin';
}

/**
 * Checks whether a role is a seller or dealer with car submission rights.
 */
export function isSellerRole(role?: UserRole | null): boolean {
  return role === 'seller' || role === 'dealer' || isStaffRole(role);
}
