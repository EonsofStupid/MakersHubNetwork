
import { 
  RouterProvider,
  createRouter,
} from '@tanstack/react-router';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { routeRegistry } from './routeRegistry';
import { getThemeContextForRoute } from './routeRegistry';
import { useLoggingContext } from '@/logging/context/LoggingContext';
import { LogConsole } from '@/logging/components/LogConsole';
import { LogToggleButton } from '@/logging/components/LogToggleButton';
import { useEffect, useState } from 'react';
import { getLogger } from '@/logging';

const logger = getLogger('Router');

// Try to build a safe route tree with error handling
const buildRouteTree = () => {
  try {
    // Combine all route trees with safety checks
    if (routeRegistry.site.root) {
      const children = [];
      
      // Add admin routes if available
      if (routeRegistry.admin.tree && routeRegistry.admin.tree.children) {
        children.push(...routeRegistry.admin.tree.children);
      }
      
      // Add chat routes if available
      if (routeRegistry.chat.tree && routeRegistry.chat.tree.children) {
        children.push(...routeRegistry.chat.tree.children);
      }
      
      return routeRegistry.site.root.addChildren(children);
    }
    
    throw new Error('Site root route not available');
  } catch (error) {
    logger.error('Failed to build route tree', { 
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};

// Create the router instance with error handling
export const router = (() => {
  try {
    const routeTree = buildRouteTree();
    
    return createRouter({ 
      routeTree,
      defaultPreload: 'intent',
      defaultPreloadStaleTime: 0,
    });
  } catch (error) {
    logger.error('Failed to create router', { 
      error: error instanceof Error ? error.message : String(error)
    });
    
    // Return a minimal router that at least won't crash the app
    const minimalTree = routeRegistry.site.root;
    return createRouter({
      routeTree: minimalTree,
      defaultComponent: () => (
        <div className="p-8">
          <h1 className="text-xl font-bold mb-4">Router Initialization Error</h1>
          <p>Please check the console for details and try refreshing the page.</p>
        </div>
      )
    });
  }
})();

// Router provider component with global logging components
export function AppRouter() {
  const [currentScope, setCurrentScope] = useState<'site' | 'admin' | 'chat'>('site');
  const pathname = router.state.location.pathname;
  const logger = getLogger('AppRouter');
  
  // Update the current scope when the pathname changes
  useEffect(() => {
    try {
      if (pathname.startsWith('/admin')) {
        setCurrentScope('admin');
        logger.info('Set scope to admin');
      } else if (pathname.startsWith('/chat')) {
        setCurrentScope('chat');
        logger.info('Set scope to chat');
      } else {
        setCurrentScope('site');
        logger.info('Set scope to site');
      }
    } catch (error) {
      logger.error('Error setting scope', { details: { error, pathname } });
      // Default to site scope on error for resilience
      setCurrentScope('site');
    }
  }, [pathname, logger]);

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
      <RouterProvider 
        router={router}
        context={{
          scope: currentScope,
          themeContext: getThemeContextForRoute(pathname)
        }} 
        defaultPendingComponent={<div className="flex items-center justify-center h-screen">
          <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>}
        defaultErrorComponent={({ error }) => (
          <div className="flex items-center justify-center h-screen flex-col">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <pre className="bg-red-50 p-4 rounded border border-red-200 max-w-md overflow-auto">
              {error instanceof Error ? error.message : String(error)}
            </pre>
          </div>
        )}
      />
      <GlobalLoggingComponents />
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

// Type declarations for our routes
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
  
  // Add custom context for scope-based rendering
  interface RouterContext {
    scope: 'site' | 'admin' | 'chat';
    themeContext: ThemeContext;
  }
}

// Export a utility to get the current scope
export const useRouterScope = () => {
  return router.useRouterContext().scope;
};

export default router;
