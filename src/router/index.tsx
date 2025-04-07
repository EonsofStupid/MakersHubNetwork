
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
  
  // Update the current scope when the pathname changes
  useEffect(() => {
    if (pathname.startsWith('/admin')) {
      setCurrentScope('admin');
    } else if (pathname.startsWith('/chat')) {
      setCurrentScope('chat');
    } else {
      setCurrentScope('site');
    }
  }, [pathname]);

  return (
    <>
      <RouterProvider 
        router={router}
        context={{
          scope: currentScope,
          themeContext: getThemeContextForRoute(pathname)
        }} 
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
