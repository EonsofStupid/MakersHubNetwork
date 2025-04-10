
/**
 * Enum for user roles in the application
 * This is the central source of truth for all roles across the application
 */
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EDITOR = 'editor',
  MODERATOR = 'moderator',
  BUILDER = 'builder',
  MAKER = 'maker',
  VIEWER = 'viewer',
  USER = 'user',
}

/**
 * Type for role array - used for strict type checking
 */
export type UserRoleArray = UserRole[];

/**
 * Map from string roles to enum values - used only for external APIs
 * This helps with type safety when dealing with string values from APIs
 */
export const mapStringToRole = (role: string): UserRole | null => {
  if (Object.values(UserRole).includes(role as UserRole)) {
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
