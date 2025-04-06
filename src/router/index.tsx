
import { 
  Outlet,
  RouterProvider,
  createRouter,
  createRootRoute,
  createRoute,
  Navigate
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
  id: 'site', // Add explicit ID to prevent duplicates
  path: '/',
  component: SiteLayout
});

// Index route
const indexRoute = createRoute({
  getParentRoute: () => siteRoute,
  id: 'index', // Add explicit ID to prevent duplicates
  path: '/',
  component: Index
});

// Login route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'login', // Add explicit ID
  path: '/login',
  component: Login
});

// Profile route
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'profile', // Add explicit ID
  path: '/profile',
  component: () => <div>Profile Page</div> // Placeholder component
});

// Settings route
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'settings', // Add explicit ID
  path: '/settings',
  component: () => <div>Settings Page</div> // Placeholder component
});

// Admin route
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'admin', // Add explicit ID
  path: '/admin/*',
  component: Admin
});

// Register core routes - note that admin routes are registered separately in Admin.tsx
export const routeTree = rootRoute.addChildren([
  siteRoute.addChildren([indexRoute]),
  loginRoute,
  profileRoute,
  settingsRoute,
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
