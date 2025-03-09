
import { lazy, Suspense } from 'react';
import { 
  createRootRoute, 
  createRoute, 
  createRouter,
  Outlet,
  redirect,
  RouterProvider
} from '@tanstack/react-router';
import { AuthGuard } from '@/components/AuthGuard';
import { MainNav } from '@/components/MainNav';
import { Footer } from '@/components/Footer';

// Loading component for route suspense
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="p-4 text-center">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Lazy load pages
const IndexPage = lazy(() => import("@/pages/Index"));
const LoginPage = lazy(() => import("@/pages/Login"));

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
    </>
  ),
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
});

// Import admin router to compose with main router
import { adminRoute } from '@/admin/router';

// Build the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  adminRoute, // Admin section route
]);

// Create the router
export const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
});

// Set up types for route params
export type AppRouteParams = {
  '/': {};
  '/login': {};
};

// Make sure types are properly merged
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
