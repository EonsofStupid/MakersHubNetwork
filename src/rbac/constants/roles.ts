
/**
 * RBAC Role Definitions
 * Central source of truth for role definitions in the application
 */

// Define all possible user roles
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  MODERATOR = 'moderator',
  BUILDER = 'builder',
  GUEST = 'guest'
}

// For backwards compatibility and easier usage
export const ROLES = {
  USER: UserRole.USER,
  ADMIN: UserRole.ADMIN,
  SUPER_ADMIN: UserRole.SUPER_ADMIN,
  MODERATOR: UserRole.MODERATOR,
  BUILDER: UserRole.BUILDER,
  GUEST: UserRole.GUEST
} as const;

// Role groupings for convenient access checks
export const ROLE_GROUPS = {
  ADMIN_ONLY: [UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[],
  SUPER_ADMINS: [UserRole.SUPER_ADMIN] as UserRole[],
  MODERATORS: [UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[],
  BUILDERS: [UserRole.BUILDER, UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[],
  AUTHENTICATED: [UserRole.USER, UserRole.MODERATOR, UserRole.BUILDER, UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[],
};

// Role priorities (higher number = higher priority)
export const ROLE_PRIORITY: Record<UserRole, number> = {
  [UserRole.GUEST]: 0,
  [UserRole.USER]: 1,
  [UserRole.BUILDER]: 2,
  [UserRole.MODERATOR]: 3,
  [UserRole.ADMIN]: 4,
  [UserRole.SUPER_ADMIN]: 5,
};

// Human-readable role labels
export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.GUEST]: 'Guest',
  [UserRole.USER]: 'User',
  [UserRole.BUILDER]: 'Builder',
  [UserRole.MODERATOR]: 'Moderator',
  [UserRole.ADMIN]: 'Admin',
  [UserRole.SUPER_ADMIN]: 'Super Admin',
};
