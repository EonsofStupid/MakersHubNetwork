
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './site';
import { AdminLayout } from '@/admin/components/layouts/AdminLayout';
import { AdminAuthGuard } from '@/admin/components/AdminAuthGuard';
import React from 'react';

// Import admin pages (Lazy load them for better performance)
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

// Loading component for lazy-loaded routes
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

// Admin base route
const adminBaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'admin-dashboard',
  component: AdminLayout
});

// Dashboard route
const dashboardRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/dashboard',
  component: () => <React.Suspense fallback={<PageLoader />}><Dashboard /></React.Suspense>
});

// Users route
const usersRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/users',
  component: () => <React.Suspense fallback={<PageLoader />}><UsersPage /></React.Suspense>
});

// Parts route
const partsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/parts',
  component: () => <React.Suspense fallback={<PageLoader />}><PartsPage /></React.Suspense>
});

// Builds route
const buildsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/builds',
  component: () => <React.Suspense fallback={<PageLoader />}><BuildsPage /></React.Suspense>
});

// Themes route
const themesRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/themes',
  component: () => <React.Suspense fallback={<PageLoader />}><ThemesPage /></React.Suspense>
});

// Content route
const contentRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/content',
  component: () => <React.Suspense fallback={<PageLoader />}><ContentPage /></React.Suspense>
});

// Settings route
const settingsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/settings',
  component: () => <React.Suspense fallback={<PageLoader />}><SettingsPage /></React.Suspense>
});

// Permissions route
const permissionsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/permissions',
  component: () => <React.Suspense fallback={<PageLoader />}><PermissionsPage /></React.Suspense>
});

// Logs route
const logsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/logs',
  component: () => <React.Suspense fallback={<PageLoader />}><LogsPage /></React.Suspense>
});

// Unauthorized page
const unauthorizedRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '/unauthorized',
  component: () => <React.Suspense fallback={<PageLoader />}><UnauthorizedPage /></React.Suspense>
});

// Not found page
const notFoundRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '*',
  component: () => <React.Suspense fallback={<PageLoader />}><NotFoundPage /></React.Suspense>
});

// Export all admin routes
export const adminRoutes = [
  adminBaseRoute.addChildren([
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
    notFoundRoute
  ])
];
