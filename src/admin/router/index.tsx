
import { lazy, Suspense } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { 
  createRootRoute, 
  createRoute, 
  createRouter,
  Outlet,
  redirect
} from '@tanstack/react-router';

// Loader component
const Loading = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="space-y-4 text-center">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Lazy-loaded components with proper default imports
const OverviewTab = lazy(() => import('@/admin/dashboard/OverviewTab').then(mod => ({ default: mod.OverviewTab })));
const ContentTab = lazy(() => import('@/admin/tabs/ContentTab'));
const UsersTab = lazy(() => import('@/admin/tabs/UsersTab').then(mod => ({ default: mod.UsersTab })));
const ChatTab = lazy(() => import('@/admin/tabs/ChatTab').then(mod => ({ default: mod.ChatTab })));
const DataMaestroTab = lazy(() => import('@/admin/tabs/DataMaestroTab').then(mod => ({ default: mod.DataMaestroTab })));
const ImportTab = lazy(() => import('@/admin/tabs/ImportTab').then(mod => ({ default: mod.ImportTab })));
const SettingsTab = lazy(() => import('@/admin/tabs/SettingsTab').then(mod => ({ default: mod.SettingsTab })));

// Create root route
const rootRoute = createRootRoute({
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
const adminIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  beforeLoad: () => {
    // Redirect to overview by default 
    return redirect({ to: '/admin/overview' });
  }
});

const overviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/overview',
  component: OverviewTab,
});

const contentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/content',
  component: ContentTab,
});

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: UsersTab,
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/chat',
  component: ChatTab,
});

const dataMaestroRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/data-maestro',
  component: DataMaestroTab,
});

const importRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/import',
  component: ImportTab,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/settings',
  component: SettingsTab,
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

// Create the router with proper type handling
export const adminRouter = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

// Export types for search params
export type AdminSearchParams = Record<string, string>;

// Export for use in components
export { rootRoute };

// Make sure types are happy with proper declaration merging
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof adminRouter;
  }
}
