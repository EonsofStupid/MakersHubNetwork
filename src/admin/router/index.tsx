
import { lazy, Suspense } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { 
  createRootRoute, 
  createRoute, 
  createRouter 
} from '@tanstack/react-router';

// Loading component
const Loading = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="space-y-4 text-center">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Create root route
const rootRoute = createRootRoute({
  component: () => {
    return (
      <AuthGuard requiredRoles={['admin', 'super_admin']}>
        <AdminLayout>
          <Suspense fallback={<Loading />}>
            {/* @ts-expect-error - TanStack router expects to be inside a RouterProvider */}
            <rootRoute.Outlet />
          </Suspense>
        </AdminLayout>
      </AuthGuard>
    );
  },
});

// Admin section routes with correct dynamic imports
const adminIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: lazy(() => import('@/admin/pages/overview/OverviewPage')),
});

const overviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/overview',
  component: lazy(() => import('@/admin/pages/overview/OverviewPage')),
});

const contentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/content',
  component: lazy(() => import('@/admin/pages/content/ContentPage')),
});

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: lazy(() => import('@/admin/pages/users/UsersPage')),
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/chat',
  component: lazy(() => import('@/admin/pages/chat/ChatPage')),
});

const dataMaestroRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/data-maestro',
  component: lazy(() => import('@/admin/pages/data-maestro/DataMaestroPage')),
});

const importRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/import',
  component: lazy(() => import('@/admin/pages/import/ImportPage')),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/settings',
  component: lazy(() => import('@/admin/pages/settings/SettingsPage')),
});

// Define all routes
const routeTree = rootRoute.addChildren([
  adminIndexRoute,
  overviewRoute,
  contentRoute,
  usersRoute,
  chatRoute,
  dataMaestroRoute,
  importRoute,
  settingsRoute,
]);

// Create the router instance
export const adminRouter = createRouter({ routeTree });

// Export types for search params
export type AdminSearchParams = {};

// Export for use in components
export { rootRoute };

// Make sure types are happy
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof adminRouter;
  }
}
