
export const ROLE_PERMISSIONS = {
  ADMIN: ['admin:access', 'admin:edit'],
  MODERATOR: ['content:edit', 'content:delete'],
  USER: ['content:view']
} as const;

export const PERMISSION_VALUES = Object.values(ROLE_PERMISSIONS).flat();

export type Permission = typeof PERMISSION_VALUES[number];
