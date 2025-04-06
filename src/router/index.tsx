
import { 
  Outlet,
  RouterProvider,
  createRouter,
  createRootRoute,
  createRoute,
  Navigate
} from '@tanstack/react-router';
import { ReactNode } from 'react';
import { z } from 'zod';
import { ROUTES, loginSearchSchema } from './routes';

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

// Define routes with proper search param validation
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
  path: '/',
  component: SiteLayout
});

// Index route
const indexRoute = createRoute({
  getParentRoute: () => siteRoute,
  id: 'index', 
  path: '/',
  component: Index
});

// Login route with search param validation
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'login', 
  path: ROUTES.LOGIN,
  validateSearch: loginSearchSchema,
  component: Login
});

// Profile route
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'profile', 
  path: ROUTES.PROFILE,
  component: () => <div>Profile Page</div>
});

// Settings route
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'settings', 
  path: ROUTES.SETTINGS,
  component: () => <div>Settings Page</div>
});

// Admin route
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'admin', 
  path: ROUTES.ADMIN,
  component: Admin
});

// Chat route
const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'chat',
  path: ROUTES.CHAT,
  component: () => <div>Chat Route</div>
});

// Register core routes - note that admin routes are registered separately in Admin.tsx
export const routeTree = rootRoute.addChildren([
  siteRoute.addChildren([indexRoute]),
  loginRoute,
  profileRoute,
  settingsRoute,
  adminRoute,
  chatRoute
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
