
import { lazy, Suspense } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { 
  createRoute, 
  Outlet,
  redirect
} from '@tanstack/react-router';
import { rootRoute } from '@/router';
import { z } from 'zod';

// Loader component
const Loading = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="space-y-4 text-center">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
      <p className="text-muted-foreground">Loading admin panel...</p>
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

// Create admin search params schema
const adminSearchParamsSchema = z.object({
  tab: z.enum(['overview', 'content', 'users', 'chat', 'data-maestro', 'import', 'settings']).optional(),
  filter: z.string().optional(),
  sort: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().optional(),
  perPage: z.coerce.number().optional(),
});

export type AdminSearchParams = z.infer<typeof adminSearchParamsSchema>;

// Create parent admin route
export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  validateSearch: adminSearchParamsSchema,
  beforeLoad: ({ context }) => {
    // Check if authenticated
    const isAuthenticated = context?.auth?.status === 'authenticated';
    const roles = context?.auth?.roles || [];
    const hasAdminRole = roles.some(role => ['admin', 'super_admin'].includes(role));

    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: '/admin',
        },
      });
    }

    if (!hasAdminRole) {
      throw redirect({
        to: '/',
      });
    }
  },
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
  getParentRoute: () => adminRoute,
  path: '/',
  beforeLoad: () => {
    // Redirect to overview by default 
    return redirect({ to: '/admin/overview' });
  }
});

const overviewRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/overview',
  component: OverviewTab,
});

const contentRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/content',
  component: ContentTab,
});

const usersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/users',
  component: UsersTab,
});

const chatRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/chat',
  component: ChatTab,
});

const dataMaestroRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/data-maestro',
  component: DataMaestroTab,
});

const importRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/import',
  component: ImportTab,
});

const settingsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/settings',
  component: SettingsTab,
});

// Add children routes to admin route
adminRoute.addChildren([
  adminIndexRoute,
  overviewRoute,
  contentRoute,
  usersRoute,
  chatRoute,
  dataMaestroRoute,
  importRoute,
  settingsRoute,
]);

// Export types for search params
declare module '@tanstack/react-router' {
  interface Register {
    adminSearchParams: AdminSearchParams;
  }
}
