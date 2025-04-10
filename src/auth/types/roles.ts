
/**
 * User roles in the application - string literal union type
 * This is the central source of truth for all roles across the application
 */
export type UserRole = 'super_admin' | 'admin' | 'editor' | 'moderator' | 'builder' | 'maker' | 'viewer' | 'user';

/**
 * Type for role array - used for strict type checking
 */
export type UserRoleArray = UserRole[];

/**
 * Constants for role values - used for convenience and type safety
 */
export const ROLES = {
  SUPER_ADMIN: 'super_admin' as UserRole,
  ADMIN: 'admin' as UserRole,
  EDITOR: 'editor' as UserRole,
  MODERATOR: 'moderator' as UserRole,
  BUILDER: 'builder' as UserRole,
  MAKER: 'maker' as UserRole,
  VIEWER: 'viewer' as UserRole,
  USER: 'user' as UserRole
} as const;

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
