
/**
 * Enum for user roles in the application
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
 * Type for UserRole string values
 * This helps with backward compatibility with string-based role checks
 */
export type UserRoleString = `${UserRole}`;

/**
 * Map from string roles to enum values
 */
export const mapStringToRole = (role: string): UserRole | null => {
  if (Object.values(UserRole).includes(role as UserRole)) {
    return role as UserRole;
  }
  return null;
};

/**
 * Convert string array to UserRole array
 */
export const mapRoleStringsToEnums = (roles: string[]): UserRole[] => {
  return roles
    .map(mapStringToRole)
    .filter((role): role is UserRole => role !== null);
};
