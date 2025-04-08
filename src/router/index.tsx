
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
import { useEffect, useState, useMemo } from 'react';
import { getLogger } from '@/logging';
import { ThemeContext } from '@/types/theme';
import { adminRoutes } from './routes/admin';
import { chatRoutes } from './routes/chat';
import { siteRoutes } from './routes/site';
import { NoHydrationMismatch } from '@/components/util/NoHydrationMismatch';
import { safeSSR } from '@/lib/utils/safeSSR';
import { isValidThemeContext } from '@/utils/typeGuards';

const logger = getLogger('Router');

// Define router context type properly
interface RouterContext {
  scope: 'site' | 'admin' | 'chat';
  themeContext: ThemeContext;
}

// Create router instance once to prevent recreating on every render
// Only recreate when needed for route changes
const createAppRouter = (pathname: string) => {
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
    
    const themeContext = getThemeContextForRoute(pathname);
    const scope = getScopeFromPathname(pathname);

    return createRouter({ 
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
      defaultComponent: () => null,
      context: {
        scope: 'site',
        themeContext: 'site' as ThemeContext
      }
    });
  }
};

// Determine scope from pathname
const getScopeFromPathname = (pathname: string): 'site' | 'admin' | 'chat' => {
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/chat')) return 'chat';
  return 'site';
};

// Get the current pathname safely (works in SSR and client)
const getCurrentPathname = () => {
  return safeSSR(() => window.location.pathname, '/');
};

// Create the router instance at module level with initial pathname
export const router = createAppRouter(getCurrentPathname());

// Router provider component with global logging components - wrapped with memo
export function AppRouter() {
  const [currentScope, setCurrentScope] = useState<'site' | 'admin' | 'chat'>('site');
  const [isClient, setIsClient] = useState(false);
  const { showLogConsole } = useLoggingContext();
  
  // Get current pathname safely
  const pathname = safeSSR(() => router.state.location.pathname, '/');
  
  // Mark when we're on the client to prevent hydration issues
  useEffect(() => {
    // Just mark as client, no need for a timeout
    setIsClient(true);
    document.documentElement.setAttribute('data-hydrated', 'true');
  }, []);
  
  // Update the current scope when the pathname changes - with memoization
  const routerContext = useMemo(() => {
    const scope = getScopeFromPathname(pathname);
    const themeContext = getThemeContextForRoute(pathname);
    
    return {
      scope,
      themeContext
    } as RouterContext;
  }, [pathname]);
  
  // Update scope state when pathname changes, for components that might need it
  useEffect(() => {
    if (!isClient) return; // Skip during SSR
    setCurrentScope(getScopeFromPathname(pathname));
  }, [pathname, isClient]);
  
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
          context={isClient ? routerContext : initialContext} 
        />
        {isClient && showLogConsole && <LogConsole />}
        {isClient && <LogToggleButton />}
      </NoHydrationMismatch>
    </ErrorBoundary>
  );
}

// Create a hook to use the router for safer access
export function useRouter() {
  return router;
}

export default router;
