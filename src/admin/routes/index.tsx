
import React from 'react';

// Re-export the AdminRoutes component
export { AdminRoutes } from './AdminRoutes';

// Export a dummy path mapping for legacy code support
export const adminRoutes = {
  base: '/admin',
  dashboard: '/admin/dashboard',
  users: '/admin/users',
  parts: '/admin/parts',
  builds: '/admin/builds',
  themes: '/admin/themes',
  content: '/admin/content',
  settings: '/admin/settings',
  permissions: '/admin/permissions',
  logs: '/admin/logs',
  unauthorized: '/admin/unauthorized',
  notFound: '/admin/not-found'
};
