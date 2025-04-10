
import { UserRole, ROLES } from '@/types/shared';

/**
 * Type for role array - used for strict type checking
 */
export type UserRoleArray = UserRole[];

/**
 * Re-export ROLES from shared types
 */
export { ROLES };
export type { UserRole };

/**
 * Map from string roles to typed UserRole - used only for external APIs
 * This helps with type safety when dealing with string values from APIs
 */
export const mapStringToRole = (role: string): UserRole | null => {
  if (Object.values(ROLES).includes(role as UserRole)) {
    return role as UserRole;
  }
  return null;
};

/**
 * Convert string array to UserRole array - used only for external APIs
 */
export const mapRoleStringsToEnums = (roles: string[]): UserRole[] => {
  return roles
    .map(mapStringToRole)
    .filter((role): role is UserRole => role !== null);
};
