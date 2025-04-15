export const PATH_POLICIES = {
  '/admin': [ROLES.admin, ROLES.super_admin],
  '/admin/users': [ROLES.admin, ROLES.super_admin],
  '/admin/roles': [ROLES.super_admin],
  '/admin/permissions': [ROLES.super_admin],
  '/admin/analytics': [ROLES.admin, ROLES.super_admin],
  '/projects/create': [ROLES.builder, ROLES.admin, ROLES.super_admin],
  '/projects/edit': [ROLES.builder, ROLES.admin, ROLES.super_admin],
  '/projects/delete': [ROLES.admin, ROLES.super_admin],
} as const;
