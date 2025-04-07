
import { 
  RouterProvider,
  createRouter,
} from '@tanstack/react-router';

import { routeRegistry } from './routeRegistry';
import { getThemeContextForRoute } from './routeRegistry';
import { useLoggingContext } from '@/logging/context/LoggingContext';
import { LogConsole } from '@/logging/components/LogConsole';
import { LogToggleButton } from '@/logging/components/LogToggleButton';
import { useEffect, useState } from 'react';
import { getLogger } from '@/logging';

// Combine all route trees
const routeTree = routeRegistry.site.root.addChildren([
  ...routeRegistry.admin.tree.children,
  ...routeRegistry.chat.tree.children
]);

// Create the router instance
export const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
});

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
    <>
      <RouterProvider 
        router={router}
        context={{
          scope: currentScope,
          themeContext: getThemeContextForRoute(pathname)
        }} 
        defaultPendingComponent={<div>Loading...</div>}
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
