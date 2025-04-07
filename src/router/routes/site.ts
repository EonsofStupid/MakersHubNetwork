
import { 
  createRoute,
  createRootRoute,
  Outlet
} from '@tanstack/react-router';
import { ReactNode } from 'react';
import { z } from 'zod';

import { MainNav } from '@/components/MainNav';
import { Footer } from '@/components/Footer';
import { LogToggleButton } from '@/logging/components/LogToggleButton';
import { LogConsole } from '@/logging/components/LogConsole';
import { useLoggingContext } from '@/logging/context/LoggingContext';

// Import pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';

// Login search params schema
export const loginSearchSchema = z.object({
  redirectTo: z.string().optional(),
  error: z.string().optional(),
});

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
  component: ({ children }) => (
    <RootLayout>
      {children}
    </RootLayout>
  )
});

// Site route with navigation and footer
export const siteBaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SiteLayout
});

// Index page route
const indexRoute = createRoute({
  getParentRoute: () => siteBaseRoute,
  path: '',
  component: Index
});

// Login route with search param validation
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  validateSearch: (search) => loginSearchSchema.parse(search),
  component: Login
});

// Create a complete site route tree
const siteRouteTree = rootRoute.addChildren([
  siteBaseRoute.addChildren([indexRoute]),
  loginRoute
]);

// Export individual routes and the complete tree
export const siteRoutes = {
  root: rootRoute,
  base: siteBaseRoute,
  index: indexRoute,
  login: loginRoute,
  tree: siteRouteTree
};

export { Outlet } from '@tanstack/react-router';
