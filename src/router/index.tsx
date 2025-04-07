
import { 
  RouterProvider,
  createRouter,
} from '@tanstack/react-router';

import { rootRoute } from './routes/site';
import { siteRoutes } from './routes/site';
import { adminRoutes } from './routes/admin';
import { chatRoutes } from './routes/chat';
import { routeRegistry } from './routeRegistry';
import { getThemeContextForRoute } from './routeRegistry';
import { LogConsole } from '@/logging/components/LogConsole';
import { LogToggleButton } from '@/logging/components/LogToggleButton';
import { useLoggingContext } from '@/logging/context/LoggingContext';

// Remember - TanStack Router requires that all routes have a unique ID
// If you're getting duplicate route ID errors, ensure all route paths are unique
// You can also explicitly set IDs with `id: 'your-unique-id'` in createRoute options

// Combine all routes
const routeTree = rootRoute.addChildren([
  ...siteRoutes,
  ...adminRoutes,
  ...chatRoutes
]);

// Create the router instance
export const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
});

// Router provider component with global logging components
export function AppRouter() {
  return (
    <>
      <RouterProvider router={router} />
      <GlobalLoggingComponents />
    </>
  );
}

// Logging components wrapper - always available regardless of route
function GlobalLoggingComponents() {
  const { showLogConsole } = useLoggingContext();
  
  return (
    <>
      {showLogConsole && <LogConsole />}
      <LogToggleButton />
    </>
  );
}

// Type declarations for our routes
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default router;
