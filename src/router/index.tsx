
import { 
  Outlet,
  RouterProvider,
  createRouter,
  createRootRoute,
  createRoute
} from '@tanstack/react-router';
import { ReactNode } from 'react';

import { MainNav } from '@/components/MainNav';
import { Footer } from '@/components/Footer';
import { LogToggleButton } from '@/logging/components/LogToggleButton';
import { LogConsole } from '@/logging/components/LogConsole';
import { useLoggingContext } from '@/logging/context/LoggingContext';

// Import pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Admin from '@/pages/Admin';

// Root layout component that includes site-wide UI elements
function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-root w-full max-w-full min-h-screen flex flex-col">
      {children}
      <LoggingComponents />
    </div>
  );
}

// Logging components wrapper to avoid context issues
function LoggingComponents() {
  const { showLogConsole } = useLoggingContext();
  
  return (
    <>
      {showLogConsole && <LogConsole />}
      <LogToggleButton />
    </>
  );
}

// Site layout with nav and footer
function SiteLayout() {
  return (
    <>
      <MainNav />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

// Define routes
export const rootRoute = createRootRoute({
  component: () => (
    <RootLayout>
      <Outlet />
    </RootLayout>
  )
});

// Site route with navigation and footer
const siteRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'site',
  component: SiteLayout
});

// Index route
const indexRoute = createRoute({
  getParentRoute: () => siteRoute,
  path: '/',
  component: Index
});

// Login route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login
});

// Admin route
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: Admin
});

// Register all routes
const routeTree = rootRoute.addChildren([
  siteRoute.addChildren([indexRoute]),
  loginRoute,
  adminRoute
]);

// Create the router instance
export const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
});

// Router provider component
export function AppRouter() {
  return <RouterProvider router={router} />;
}

// Type declarations for our routes
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default router;
