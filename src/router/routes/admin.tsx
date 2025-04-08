
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './site';
import React from 'react';
import { z } from 'zod';
import { AdminLayout } from '@/admin/components/layouts/AdminLayout';

// Zod schema for admin route params
export const adminParamsSchema = {
  buildId: z.string(),
  userId: z.string(),
  themeId: z.string()
};

// Loading component for lazy-loaded routes
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

// Safe wrapper for lazy-loaded components
const safeComponent = <T extends React.ComponentType<any>>(LazyComp: React.LazyExoticComponent<T>) => {
  return function SafeComponent() {
    return (
      <React.Suspense fallback={<PageLoader />}>
        <LazyComp />
      </React.Suspense>
    );
  };
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
  component: safeComponent(Dashboard)
});

// Users route
const usersRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/users',
  component: safeComponent(UsersPage)
});

// Parts route
const partsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/parts',
  component: safeComponent(PartsPage)
});

// Builds route
const buildsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/builds',
  component: safeComponent(BuildsPage)
});

// Themes route
const themesRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/themes',
  component: safeComponent(ThemesPage)
});

// Content route
const contentRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/content',
  component: safeComponent(ContentPage)
});

// Settings route
const settingsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/settings',
  component: safeComponent(SettingsPage)
});

// Permissions route
const permissionsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/permissions',
  component: safeComponent(PermissionsPage)
});

// Logs route
const logsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/logs',
  component: safeComponent(LogsPage)
});

// Unauthorized route
const unauthorizedRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/unauthorized',
  component: safeComponent(UnauthorizedPage)
});

// Admin not found route
const adminNotFoundRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '*',
  component: safeComponent(NotFoundPage)
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
