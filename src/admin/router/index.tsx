
import { lazy, Suspense } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { ErrorBoundary } from '@/components/ErrorBoundary';
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

// Wrap lazy-loaded components in dedicated components
// This ensures proper Suspense handling
const OverviewTabWrapper = () => {
  const TabComponent = lazy(() => import('../tabs/OverviewTab'));
  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary>
        <TabComponent />
      </ErrorBoundary>
    </Suspense>
  );
};

const ContentTabWrapper = () => {
  const TabComponent = lazy(() => import('../tabs/ContentTab'));
  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary>
        <TabComponent />
      </ErrorBoundary>
    </Suspense>
  );
};

const UsersTabWrapper = () => {
  const TabComponent = lazy(() => import('../tabs/UsersTab'));
  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary>
        <TabComponent />
      </ErrorBoundary>
    </Suspense>
  );
};

const ChatTabWrapper = () => {
  const TabComponent = lazy(() => import('../tabs/ChatTab'));
  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary>
        <TabComponent />
      </ErrorBoundary>
    </Suspense>
  );
};

const DataMaestroTabWrapper = () => {
  const TabComponent = lazy(() => import('../tabs/DataMaestroTab'));
  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary>
        <TabComponent />
      </ErrorBoundary>
    </Suspense>
  );
};

const ImportTabWrapper = () => {
  const TabComponent = lazy(() => import('../tabs/ImportTab'));
  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary>
        <TabComponent />
      </ErrorBoundary>
    </Suspense>
  );
};

const SettingsTabWrapper = () => {
  const TabComponent = lazy(() => import('../tabs/SettingsTab'));
  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary>
        <TabComponent />
      </ErrorBoundary>
    </Suspense>
  );
};

// Create root route with proper layout and authentication
const rootRoute = createRootRoute({
  component: () => (
    <AuthGuard requiredRoles={['admin', 'super_admin']}>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </AuthGuard>
  ),
  // Add global error handling
  errorComponent: ({ error }) => (
    <div className="p-4 text-destructive">
      <h2>Error: {error instanceof Error ? error.message : 'Unknown error'}</h2>
    </div>
  ),
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
  component: OverviewTabWrapper,
});

const contentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/content',
  component: ContentTabWrapper,
});

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: UsersTabWrapper,
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/chat',
  component: ChatTabWrapper,
});

const dataMaestroRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/data-maestro',
  component: DataMaestroTabWrapper,
});

const importRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/import',
  component: ImportTabWrapper,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/settings',
  component: SettingsTabWrapper,
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

// Create the router with proper configuration
export const adminRouter = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultErrorComponent: ({ error }) => (
    <div className="p-4 m-2 text-center border border-destructive/20 rounded-md">
      <h3 className="text-base font-medium text-destructive mb-1">Router Error</h3>
      <p className="text-sm text-muted-foreground">
        {error instanceof Error ? error.message : 'An unknown error occurred'}
      </p>
    </div>
  ),
});

// Export types for search params
export type AdminSearchParams = Record<string, string>;

// Export for use in components
export { rootRoute };

// Make sure types are happy
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof adminRouter;
  }
}
