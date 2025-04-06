
import React from 'react';
import { Outlet, createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/router';
import { AdminLayout } from '@/admin/components/layouts/AdminLayout';
import { AdminAuthGuard } from '@/admin/components/AdminAuthGuard';

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

// Define the admin route with layout
export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminAuthGuard>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </AdminAuthGuard>
  ),
});

// Admin dashboard route
export const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/dashboard',
  component: () => (
    <React.Suspense fallback={<PageLoader />}>
      <Dashboard />
    </React.Suspense>
  ),
});

// Admin builds route
export const adminBuildsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/builds',
  component: () => (
    <React.Suspense fallback={<PageLoader />}>
      <BuildsPage />
    </React.Suspense>
  ),
});

// Admin users route
export const adminUsersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/users',
  component: () => (
    <React.Suspense fallback={<PageLoader />}>
      <UsersPage />
    </React.Suspense>
  ),
});

// Admin parts route
export const adminPartsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/parts',
  component: () => (
    <React.Suspense fallback={<PageLoader />}>
      <PartsPage />
    </React.Suspense>
  ),
});

// Admin themes route
export const adminThemesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/themes',
  component: () => (
    <React.Suspense fallback={<PageLoader />}>
      <ThemesPage />
    </React.Suspense>
  ),
});

// Admin content route
export const adminContentRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/content',
  component: () => (
    <React.Suspense fallback={<PageLoader />}>
      <ContentPage />
    </React.Suspense>
  ),
});

// Admin settings route
export const adminSettingsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/settings',
  component: () => (
    <React.Suspense fallback={<PageLoader />}>
      <SettingsPage />
    </React.Suspense>
  ),
});

// Admin permissions route
export const adminPermissionsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/permissions',
  component: () => (
    <React.Suspense fallback={<PageLoader />}>
      <PermissionsPage />
    </React.Suspense>
  ),
});

// Admin logs route
export const adminLogsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/logs',
  component: () => (
    <React.Suspense fallback={<PageLoader />}>
      <LogsPage />
    </React.Suspense>
  ),
});

// Admin unauthorized route
export const adminUnauthorizedRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/unauthorized',
  component: () => (
    <React.Suspense fallback={<PageLoader />}>
      <UnauthorizedPage />
    </React.Suspense>
  ),
});

// Admin not found route (catch-all)
export const adminNotFoundRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '*',
  component: () => (
    <React.Suspense fallback={<PageLoader />}>
      <NotFoundPage />
    </React.Suspense>
  ),
});

// Register all admin routes
adminRoute.addChildren([
  adminDashboardRoute,
  adminBuildsRoute,
  adminUsersRoute,
  adminPartsRoute,
  adminThemesRoute,
  adminContentRoute,
  adminSettingsRoute,
  adminPermissionsRoute,
  adminLogsRoute,
  adminUnauthorizedRoute,
  adminNotFoundRoute,
]);

// Export for use in the main router
export const adminRoutes = [adminRoute];
