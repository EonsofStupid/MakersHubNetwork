import { 
  RouterProvider,
  createRouter,
} from '@tanstack/react-router';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { rootRoute } from '@/router/routes/site';
import { getThemeContextForRoute } from '@/router/routeRegistry';
import { useLoggingContext } from '@/logging/context/LoggingContext';
import { LogConsole } from '@/logging/components/LogConsole';
import { LogToggleButton } from '@/logging/components/LogToggleButton';
import { useEffect, useState } from 'react';
import { getLogger } from '@/logging';
import { ThemeContext } from '@/types/theme';
import { adminRoutes } from './routes/admin';
import { chatRoutes } from './routes/chat';
import { siteRoutes } from './routes/site';
import { NoHydrationMismatch } from '@/components/util/NoHydrationMismatch';
import { safeSSR } from '@/lib/utils/safeSSR';
import { stringToBoolean } from '@/utils/typeGuards';

const logger = getLogger('Router');

// Define router context type properly
interface RouterContext {
  scope: 'site' | 'admin' | 'chat';
  themeContext: ThemeContext;
}

// Try to build a safe route tree with error handling
const buildRouteTree = () => {
  try {
    const routeTree = siteRoutes.root;
    
    if (adminRoutes?.tree) {
      routeTree.addChildren([adminRoutes.tree]);
    }
    
    if (chatRoutes?.tree) {
      routeTree.addChildren([chatRoutes.tree]);
    }
    
    return routeTree;
  } catch (error) {
    logger.error('Failed to build route tree', { 
      details: { error: error instanceof Error ? error.message : String(error) }
    });
    throw error;
  }
};

// Get the current pathname safely (works in SSR and client)
const getCurrentPathname = () => {
  return safeSSR(() => window.location.pathname, '/');
};

// Determine scope from pathname
const getScopeFromPathname = (pathname: string): 'site' | 'admin' | 'chat' => {
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/chat')) return 'chat';
  return 'site';
};

// Create the router instance with error handling and proper typings
export const router = (() => {
  try {
    const routeTree = buildRouteTree();
    const pathname = getCurrentPathname();
    const themeContext = getThemeContextForRoute(pathname);
    const scope = getScopeFromPathname(pathname);
    
    return createRouter({ 
      routeTree,
      defaultPreload: 'intent',
      defaultPreloadStaleTime: 0,
      defaultComponent: () => null, // Prevent hydration issues with default component
      context: {
        scope,
        themeContext
      } as RouterContext
    });
  } catch (error) {
    logger.error('Failed to create router', { 
      details: { error: error instanceof Error ? error.message : String(error) }
    });
    
    // Return a minimal router that at least won't crash the app
    const minimalTree = rootRoute;
    return createRouter({
      routeTree: minimalTree,
      defaultComponent: () => null, // Prevent hydration issues with default component
      context: {
        scope: 'site',
        themeContext: 'site' as ThemeContext
      }
    });
  }
})();

// Router provider component with global logging components
export function AppRouter() {
  const [currentScope, setCurrentScope] = useState<'site' | 'admin' | 'chat'>('site');
  const [isClient, setIsClient] = useState(false);
  const pathname = safeSSR(() => router.state.location.pathname, '/');
  const logger = getLogger('AppRouter');
  
  // Mark when we're on the client to prevent hydration issues
  useEffect(() => {
    // Use a timeout to ensure we're fully hydrated
    const timer = setTimeout(() => {
      setIsClient(true);
      document.documentElement.setAttribute('data-hydrated', 'true');
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Update the current scope when the pathname changes
  useEffect(() => {
    if (!isClient) return; // Skip during SSR
    
    try {
      const newScope = getScopeFromPathname(pathname);
      setCurrentScope(newScope);
      logger.info(`Set scope to ${newScope}`);
    } catch (error) {
      logger.error('Error setting scope', { details: { error, pathname } });
      // Default to site scope on error for resilience
      setCurrentScope('site');
    }
  }, [pathname, logger, isClient]);

  // Use a consistent initial context for SSR
  const initialContext: RouterContext = {
    scope: 'site',
    themeContext: 'site' as ThemeContext
  };

  return (
    <ErrorBoundary
      fallback={
        <div className="flex items-center justify-center h-screen flex-col">
          <h1 className="text-2xl font-bold mb-4">Something went wrong with the router</h1>
          <p className="text-lg mb-4">Please try refreshing the page</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Refresh
          </button>
        </div>
      }
    >
      <NoHydrationMismatch
        fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        }
      >
        <RouterProvider 
          router={router}
          context={isClient ? {
            scope: currentScope,
            themeContext: getThemeContextForRoute(pathname)
          } : initialContext} 
          defaultPendingComponent={() => (
            <div className="flex items-center justify-center h-screen">
              <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          )}
          defaultErrorComponent={({ error }) => (
            <div className="flex items-center justify-center h-screen flex-col">
              <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
              <pre className="bg-red-50 p-4 rounded border border-red-200 max-w-md overflow-auto">
                {error instanceof Error ? error.message : String(error)}
              </pre>
            </div>
          )}
        />
        {isClient && <GlobalLoggingComponents />}
      </NoHydrationMismatch>
    </ErrorBoundary>
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

// Create a hook to use the router for safer access
export function useRouter() {
  return router;
}

export default router;
