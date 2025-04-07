
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './site';
import React from 'react';
import { z } from 'zod';

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

// Lazy load the admin components
const AdminLayout = React.lazy(() => import('@/admin/components/layouts/AdminLayout').then(mod => ({ default: mod.default })));
const Dashboard = React.lazy(() => import('@/admin/routes/dashboard/DashboardPage').then(mod => ({ default: mod.default })));
const BuildsPage = React.lazy(() => import('@/admin/routes/builds/BuildsPage').then(mod => ({ default: mod.default })));
const UsersPage = React.lazy(() => import('@/admin/routes/users/UsersPage').then(mod => ({ default: mod.default })));
const PartsPage = React.lazy(() => import('@/admin/routes/parts/PartsPage').then(mod => ({ default: mod.default })));
const ThemesPage = React.lazy(() => import('@/admin/routes/themes/ThemesPage').then(mod => ({ default: mod.default })));
const ContentPage = React.lazy(() => import('@/admin/routes/content/ContentPage').then(mod => ({ default: mod.default })));
const SettingsPage = React.lazy(() => import('@/admin/routes/settings/SettingsPage').then(mod => ({ default: mod.default })));
const PermissionsPage = React.lazy(() => import('@/admin/routes/permissions/PermissionsPage').then(mod => ({ default: mod.default })));
const LogsPage = React.lazy(() => import('@/admin/pages/LogsPage').then(mod => ({ default: mod.default })));
const UnauthorizedPage = React.lazy(() => import('@/admin/routes/UnauthorizedPage').then(mod => ({ default: mod.default })));
const NotFoundPage = React.lazy(() => import('@/admin/routes/NotFoundPage').then(mod => ({ default: mod.default })));

// Admin base route
const adminBaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <React.Suspense fallback={<PageLoader />}>
      <AdminLayout />
    </React.Suspense>
  )
});

// Dashboard route
const dashboardRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/dashboard',
  component: () => (
    <React.Suspense fallback={<PageLoader />}>
      <Dashboard />
    </React.Suspense>
  )
});

// Users route
const usersRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/users',
  component: () => (
    <React.Suspense fallback={<PageLoader />}>
      <UsersPage />
    </React.Suspense>
  )
});

// Parts route
const partsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/parts',
  component: () => (
    <React.Suspense fallback={<PageLoader />}>
      <PartsPage />
    </React.Suspense>
  )
});

// Builds route
const buildsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/builds',
  component: () => (
    <React.Suspense fallback={<PageLoader />}>
      <BuildsPage />
    </React.Suspense>
  )
});

// Themes route
const themesRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/themes',
  component: () => (
    <React.Suspense fallback={<PageLoader />}>
      <ThemesPage />
    </React.Suspense>
  )
});

// Content route
const contentRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/content',
  component: () => (
    <React.Suspense fallback={<PageLoader />}>
      <ContentPage />
    </React.Suspense>
  )
});

// Settings route
const settingsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/settings',
  component: () => (
    <React.Suspense fallback={<PageLoader />}>
      <SettingsPage />
    </React.Suspense>
  )
});

// Permissions route
const permissionsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/permissions',
  component: () => (
    <React.Suspense fallback={<PageLoader />}>
      <PermissionsPage />
    </React.Suspense>
  )
});

// Logs route
const logsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/logs',
  component: () => (
    <React.Suspense fallback={<PageLoader />}>
      <LogsPage />
    </React.Suspense>
  )
});

// Unauthorized route
const unauthorizedRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/unauthorized',
  component: () => (
    <React.Suspense fallback={<PageLoader />}>
      <UnauthorizedPage />
    </React.Suspense>
  )
});

// Admin not found route
const adminNotFoundRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '*',
  component: () => (
    <React.Suspense fallback={<PageLoader />}>
      <NotFoundPage />
    </React.Suspense>
  )
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
