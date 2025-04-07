
import React from 'react';
import { Outlet, createRoute } from '@tanstack/react-router';
import { createRootRoute } from '@tanstack/react-router';
import { AdminLayout } from '@/admin/components/layouts/AdminLayout';
import { AdminAuthGuard } from '@/admin/components/AdminAuthGuard';
import { AdminRoutes } from './AdminRoutes';
import { UserRole, ADMIN_ROLES } from '@/auth/types/userRoles';

// Import admin pages (Lazy load them for better performance)
const Dashboard = React.lazy(() => import('./dashboard/DashboardPage'));
const BuildsPage = React.lazy(() => import('./builds/BuildsPage'));
const UsersPage = React.lazy(() => import('./users/UsersPage'));
const PartsPage = React.lazy(() => import('./parts/PartsPage'));
const ThemesPage = React.lazy(() => import('./themes/ThemesPage'));
const ContentPage = React.lazy(() => import('./content/ContentPage'));
const SettingsPage = React.lazy(() => import('./settings/SettingsPage'));
const PermissionsPage = React.lazy(() => import('./permissions/PermissionsPage'));
const LogsPage = React.lazy(() => import('@/admin/pages/LogsPage'));
const UnauthorizedPage = React.lazy(() => import('./UnauthorizedPage'));
const NotFoundPage = React.lazy(() => import('./NotFoundPage'));

// Loading component for lazy-loaded routes
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

// Create admin root route specifically for admin router
export const adminRootRoute = createRootRoute();

// Define base admin route for all admin pages
const adminBaseRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/', // Use path only, no id
  component: AdminRoutes
});

// Dashboard route
const dashboardRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: 'dashboard', // Remove leading slash to prevent duplicate routes
  component: () => <React.Suspense fallback={<PageLoader />}><Dashboard /></React.Suspense>
});

// Users route
const usersRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: 'users', // Remove leading slash to prevent duplicate routes
  component: () => <React.Suspense fallback={<PageLoader />}><UsersPage /></React.Suspense>
});

// Parts route
const partsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: 'parts', // Remove leading slash to prevent duplicate routes
  component: () => <React.Suspense fallback={<PageLoader />}><PartsPage /></React.Suspense>
});

// Builds route
const buildsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: 'builds', // Remove leading slash to prevent duplicate routes
  component: () => <React.Suspense fallback={<PageLoader />}><BuildsPage /></React.Suspense>
});

// Themes route
const themesRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: 'themes', // Remove leading slash to prevent duplicate routes
  component: () => <React.Suspense fallback={<PageLoader />}><ThemesPage /></React.Suspense>
});

// Content route
const contentRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: 'content', // Remove leading slash to prevent duplicate routes
  component: () => <React.Suspense fallback={<PageLoader />}><ContentPage /></React.Suspense>
});

// Settings route
const settingsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: 'settings', // Remove leading slash to prevent duplicate routes
  component: () => <React.Suspense fallback={<PageLoader />}><SettingsPage /></React.Suspense>
});

// Permissions route
const permissionsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: 'permissions', // Remove leading slash to prevent duplicate routes
  component: () => <React.Suspense fallback={<PageLoader />}><PermissionsPage /></React.Suspense>
});

// Logs route
const logsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: 'logs', // Remove leading slash to prevent duplicate routes
  component: () => <React.Suspense fallback={<PageLoader />}><LogsPage /></React.Suspense>
});

// Unauthorized page
const unauthorizedRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: 'unauthorized', // Remove leading slash to prevent duplicate routes
  component: () => <React.Suspense fallback={<PageLoader />}><UnauthorizedPage /></React.Suspense>
});

// Not found page
const notFoundRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: '*', // Keep catch-all without leading slash
  component: () => <React.Suspense fallback={<PageLoader />}><NotFoundPage /></React.Suspense>
});

// Export all admin routes for registration in main router
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
