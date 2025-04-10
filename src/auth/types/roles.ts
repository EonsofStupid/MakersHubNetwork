
/**
 * auth/types/roles.ts
 * 
 * Central location for role definitions and utilities
 */

import { UserRole, ROLES } from '@/types/shared';

/**
 * Convert string role names to typed UserRole enum values
 */
export function mapRoleStringsToEnums(roleStrings: string[]): UserRole[] {
  return roleStrings.filter(role => {
    // Validate that the role exists in our defined types
    return Object.values(ROLES).includes(role as UserRole);
  }) as UserRole[];
}

// Re-export the roles constants for convenience
export { ROLES } from '@/types/shared';

// Export UserRole type for convenience
export type { UserRole } from '@/types/shared';
