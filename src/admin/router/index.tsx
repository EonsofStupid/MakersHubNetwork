
import { createRouter, createRouteConfig } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { AdminLayout } from '@/admin/components/AdminLayout';

// Lazy-loaded components
const OverviewTab = lazy(() => import('@/admin/tabs/OverviewTab'));
const ContentTab = lazy(() => import('@/admin/tabs/ContentTab'));
const UsersTab = lazy(() => import('@/admin/tabs/UsersTab'));
const ChatTab = lazy(() => import('@/admin/tabs/ChatTab'));
const DataMaestroTab = lazy(() => import('@/admin/tabs/DataMaestroTab'));
const ImportTab = lazy(() => import('@/admin/tabs/ImportTab'));
const SettingsTab = lazy(() => import('@/admin/tabs/SettingsTab'));

// Loading component
const Loading = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="space-y-4 text-center">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Create route config
const rootRouteConfig = createRouteConfig({
  component: () => {
    return (
      <AuthGuard requiredRoles={['admin', 'super_admin']}>
        <AdminLayout>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </AdminLayout>
      </AuthGuard>
    );
  },
});

// Admin section routes
const adminIndexRoute = rootRouteConfig.createRoute({
  path: '/admin',
  component: () => <OverviewTab />,
});

const overviewRoute = rootRouteConfig.createRoute({
  path: '/admin/overview',
  component: () => <OverviewTab />,
});

const contentRoute = rootRouteConfig.createRoute({
  path: '/admin/content',
  component: () => <ContentTab />,
});

const usersRoute = rootRouteConfig.createRoute({
  path: '/admin/users',
  component: () => <UsersTab />,
});

const chatRoute = rootRouteConfig.createRoute({
  path: '/admin/chat',
  component: () => <ChatTab />,
});

const dataMaestroRoute = rootRouteConfig.createRoute({
  path: '/admin/data-maestro',
  component: () => <DataMaestroTab />,
});

const importRoute = rootRouteConfig.createRoute({
  path: '/admin/import',
  component: () => <ImportTab />,
});

const settingsRoute = rootRouteConfig.createRoute({
  path: '/admin/settings',
  component: () => <SettingsTab />,
});

// Create and export router
const routeConfig = rootRouteConfig.addChildren([
  adminIndexRoute,
  overviewRoute,
  contentRoute,
  usersRoute,
  chatRoute,
  dataMaestroRoute,
  importRoute,
  settingsRoute,
]);

// Create a router instance with type-safe routes
export const adminRouter = createRouter({ routeConfig });

// Export types for search params
export type AdminSearchParams = {};

// Export an outlet component for the route nesting
export const Outlet = adminRouter.Outlet;

// Make sure types are happy
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof adminRouter;
  }
}
