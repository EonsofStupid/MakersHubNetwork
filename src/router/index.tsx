
import { 
  RouterProvider,
  createRouter,
  type AnyRoute,
} from '@tanstack/react-router';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { rootRoute } from '@/router/routes/site';
import { getThemeContextForRoute } from '@/router/routeRegistry';
import { useLoggingContext } from '@/logging/context/LoggingContext';
import { LogConsole } from '@/logging/components/LogConsole';
import { LogToggleButton } from '@/logging/components/LogToggleButton';
import { useEffect, useState, useMemo, useRef } from 'react';
import { getLogger } from '@/logging';
import { ThemeContext } from '@/types/theme';
import { adminRoutes } from './routes/admin';
import { siteRoutes } from './routes/site';
import { chatRoutes } from './routes/chat';
import { NoHydrationMismatch } from '@/components/util/NoHydrationMismatch';
import { safeSSR } from '@/lib/utils/safeSSR';
import { isValidThemeContext } from '@/utils/typeGuards';
import CircuitBreaker from '@/utils/CircuitBreaker';

const logger = getLogger('Router');

// Define router context type properly
interface RouterContext {
  scope: 'site' | 'admin' | 'chat';
  themeContext: ThemeContext;
}

// Get the current pathname safely (works in SSR and client)
const getCurrentPathname = () => {
  return safeSSR(() => window.location.pathname, '/');
};

// Initialize circuit breaker for router component
CircuitBreaker.init('AppRouter', 15, 1000);

// Initial context for the router
const initialPathname = getCurrentPathname();
const initialScope = (() => {
  if (initialPathname.startsWith('/admin')) return 'admin';
  if (initialPathname.startsWith('/chat')) return 'chat';
  return 'site';
})();
const initialThemeContext = getThemeContextForRoute(initialPathname);

// Create router instance once to prevent recreating on every render
// Use a function to create the router but wrap it with a singleton pattern
const createRouterSingleton = (() => {
  let routerInstance: ReturnType<typeof createRouter> | null = null;
  
  return () => {
    if (routerInstance) return routerInstance;
    
    try {
      // Build route tree once
      const routeTree = (() => {
        const tree = siteRoutes.root;
        
        if (adminRoutes?.tree) {
          tree.addChildren([adminRoutes.tree]);
        }
        
        if (chatRoutes?.tree) {
          tree.addChildren([chatRoutes.tree]);
        }
        
        return tree;
      })();

      const createdRouter = createRouter({ 
        routeTree,
        defaultPreload: 'intent',
        defaultPreloadStaleTime: 0,
        defaultComponent: () => null,
        defaultPendingComponent: () => (
          <div className="flex items-center justify-center h-screen">
            <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        ),
        defaultErrorComponent: ({ error }) => (
          <div className="flex items-center justify-center h-screen flex-col">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <pre className="bg-red-50 p-4 rounded border border-red-200 max-w-md overflow-auto">
              {error instanceof Error ? error.message : String(error)}
            </pre>
          </div>
        ),
        context: {
          scope: initialScope,
          themeContext: initialThemeContext
        } as RouterContext
      });
      
      routerInstance = createdRouter;
      return createdRouter;
    } catch (error) {
      logger.error('Failed to create router', { 
        details: { error: error instanceof Error ? error.message : String(error) }
      });
      
      // Return a minimal router that at least won't crash the app
      const fallbackRouter = createRouter({
        routeTree: rootRoute,
        defaultComponent: () => null,
        context: {
          scope: 'site',
          themeContext: 'site' as ThemeContext
        }
      });
      
      routerInstance = fallbackRouter;
      return fallbackRouter;
    }
  };
})();

// Create the router instance at module level - do this only once
export const router = createRouterSingleton();

// Router provider component with global logging components
export function AppRouter() {
  // Monitor for infinite loops
  useEffect(() => {
    if (CircuitBreaker.count('AppRouter')) {
      console.error('Breaking potential infinite loop in AppRouter component');
    }
  });
  
  const [currentScope, setCurrentScope] = useState<'site' | 'admin' | 'chat'>(initialScope);
  const [isClient, setIsClient] = useState(false);
  const { showLogConsole } = useLoggingContext();
  const initialRenderRef = useRef(true);
  
  // Mark when we're on the client to prevent hydration issues
  useEffect(() => {
    if (!initialRenderRef.current) return;
    initialRenderRef.current = false;
    setIsClient(true);
  }, []);
  
  // Use a consistent initial context for SSR - memoized to prevent recreation
  const routerContext = useMemo(() => {
    return {
      scope: currentScope,
      themeContext: initialThemeContext
    } as RouterContext;
  }, [currentScope]); // Only depend on currentScope
  
  // Update scope state when pathname changes, for components that might need it
  useEffect(() => {
    if (!isClient) return; // Skip during SSR
    
    const handleLocationChange = () => {
      const pathname = safeSSR(() => window.location.pathname, '/');
      const newScope = (() => {
        if (pathname.startsWith('/admin')) return 'admin';
        if (pathname.startsWith('/chat')) return 'chat';
        return 'site';
      })();
      
      setCurrentScope(prev => {
        if (prev !== newScope) return newScope;
        return prev; // Don't cause re-render if unchanged
      });
    };
    
    // Set up event listener for route changes
    window.addEventListener('popstate', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [isClient]);

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
          context={routerContext} 
        />
        {isClient && showLogConsole && <LogConsole />}
        {isClient && <LogToggleButton />}
      </NoHydrationMismatch>
    </ErrorBoundary>
  );
}

// Export the hook to use the router
export function useRouter() {
  return router;
}
