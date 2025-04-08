
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './site';
import React from 'react';
import { z } from 'zod';
import { AdminLayout } from '@/admin/components/layouts/AdminLayout';
import { withSafeSuspense } from '@/router/utils/safeRouteRegistration';

// Zod schema for admin route params
export const adminParamsSchema = {
  buildId: z.string(),
  userId: z.string(),
  themeId: z.string()
};

// Lazy load the admin components
const Dashboard = React.lazy(() => import('@/admin/routes/dashboard/DashboardPage'));
const BuildsPage = React.lazy(() => import('@/admin/routes/builds/BuildsPage'));
const UsersPage = React.lazy(() => import('@/admin/routes/users/UsersPage'));
const PartsPage = React.lazy(() => import('@/admin/routes/parts/PartsPage'));
const ThemesPage = React.lazy(() => import('@/admin/routes/themes/ThemesPage'));
const ContentPage = React.lazy(() => import('@/admin/routes/content/ContentPage'));
const SettingsPage = React.lazy(() => import('@/admin/routes/settings/SettingsPage'));
const PermissionsPage = React.lazy(() => import('@/admin/routes/permissions/PermissionsPage'));
const LogsPage = React.lazy(() => import('@/admin/pages/LogsPage'));
const UnauthorizedPage = React.lazy(() => import('@/admin/routes/UnauthorizedPage'));
const NotFoundPage = React.lazy(() => import('@/admin/routes/NotFoundPage'));

// Admin base route
const adminBaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminLayout
});

// Dashboard route
const dashboardRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/dashboard',
  component: withSafeSuspense(Dashboard)
});

// Users route
const usersRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/users',
  component: withSafeSuspense(UsersPage)
});

// Parts route
const partsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/parts',
  component: withSafeSuspense(PartsPage)
});

// Builds route
const buildsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/builds',
  component: withSafeSuspense(BuildsPage)
});

// Themes route
const themesRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/themes',
  component: withSafeSuspense(ThemesPage)
});

// Content route
const contentRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/content',
  component: withSafeSuspense(ContentPage)
});

// Settings route
const settingsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/settings',
  component: withSafeSuspense(SettingsPage)
});

// Permissions route
const permissionsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/permissions',
  component: withSafeSuspense(PermissionsPage)
});

// Logs route
const logsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/logs',
  component: withSafeSuspense(LogsPage)
});

// Unauthorized route
const unauthorizedRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/unauthorized',
  component: withSafeSuspense(UnauthorizedPage)
});

// Admin not found route
const adminNotFoundRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '*',
  component: withSafeSuspense(NotFoundPage)
});

// Create a complete admin route tree
const adminRouteTree = adminBaseRoute.addChildren([
  dashboardRoute,
  usersRoute,
  partsRoute,
  buildsRoute,
  themesRoute,
  contentRoute,
  settingsRoute,
  permissionsRoute,
  logsRoute,
  unauthorizedRoute,
  adminNotFoundRoute
]);

// Export individual routes and the complete tree
export const adminRoutes = {
  base: adminBaseRoute,
  tree: adminRouteTree,
  dashboard: dashboardRoute,
  users: usersRoute,
  parts: partsRoute,
  builds: buildsRoute,
  themes: themesRoute,
  content: contentRoute,
  settings: settingsRoute,
  permissions: permissionsRoute,
  logs: logsRoute,
  unauthorized: unauthorizedRoute,
  notFound: adminNotFoundRoute
};
