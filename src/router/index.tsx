
import { lazy, Suspense } from 'react';
import { 
  createRootRoute, 
  createRoute, 
  createRouter,
  Outlet,
  redirect,
  RouterProvider,
  ScrollRestoration,
  ErrorComponent,
  NotFoundRoute,
  Navigate
} from '@tanstack/react-router';
import { AuthGuard } from '@/components/AuthGuard';
import { MainNav } from '@/components/MainNav';
import { Footer } from '@/components/Footer';
import { z } from 'zod';

// Loading component for route suspense
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="p-4 text-center">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Error boundary component for route errors
const RouteErrorBoundary = ({ error }: { error: Error }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full p-6 text-center border border-destructive/20 rounded-md bg-background/40 backdrop-blur-md">
        <h2 className="text-xl font-bold text-destructive mb-2">Navigation Error</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {error?.message || "An error occurred while navigating to this page."}
        </p>
      </div>
    </div>
  );
};

// Lazy load pages
const IndexPage = lazy(() => import("@/pages/Index"));
const LoginPage = lazy(() => import("@/pages/Login"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));

// Create the root route layout
export const rootRoute = createRootRoute({
  component: () => (
    <>
      <MainNav />
      <main className="min-h-screen">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  ),
  errorComponent: ({ error }) => <RouteErrorBoundary error={error as Error} />,
});

// Create the public routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
  beforeLoad: ({ context, location }) => {
    // If user is already authenticated, redirect to home
    const isAuthenticated = context?.auth?.status === 'authenticated';
    if (isAuthenticated) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

// Not found route
export const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFoundPage,
});

// Import admin router to compose with main router
import { adminRoute } from '@/admin/router';

// Build the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  adminRoute, // Admin section route
  notFoundRoute, // Must be last
]);

// Create and export context schema
export const routeContextSchema = z.object({
  auth: z.object({
    status: z.enum(['idle', 'loading', 'authenticated', 'unauthenticated']),
    user: z.any().nullable(),
    roles: z.array(z.string()),
  }).optional(),
});

// Create the router with proper configuration
export const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 5 * 60 * 1000, // 5 minutes
  context: {
    auth: undefined, // Will be set in AuthProvider
  },
  defaultErrorComponent: ({ error }) => <RouteErrorBoundary error={error as Error} />,
  defaultPendingComponent: () => <PageLoader />,
  defaultNotFoundComponent: () => <NotFoundPage />,
});

// Set up types for route params and search params
export type AppRouteParams = {
  '/': Record<string, never>;
  '/login': Record<string, never>;
  '*': Record<string, never>;
};

export type AppSearchParams = {
  '/': {
    search?: string;
  };
  '/login': {
    redirect?: string;
  };
  '*': Record<string, never>;
};

// Make sure types are properly merged
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
    routeTree: typeof routeTree;
    routeContext: typeof routeContextSchema.infer;
  }
}
