
import React from 'react';
import { z } from 'zod';

// Zod schema for admin route params
export const adminParamsSchema = {
  buildId: z.string(),
  userId: z.string(),
  themeId: z.string()
};

// Define routes as strings for React Router
export const adminRouteMap = {
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
