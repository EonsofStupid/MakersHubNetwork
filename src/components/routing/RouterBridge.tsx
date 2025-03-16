
import React, { useCallback } from 'react';
import { useNavigate as useReactNavigate } from 'react-router-dom';
import { adminRouter } from '@/admin/router';
import { useToast } from '@/hooks/use-toast';

interface RouterBridgeProps {
  children: React.ReactNode;
}

// Context to share the navigation utilities
export const RouterBridgeContext = React.createContext<{
  navigateTo: (path: string) => void;
  isAdminRoute: (path: string) => boolean;
}>({
  navigateTo: () => {},
  isAdminRoute: () => false,
});

// Regular expression to match admin routes
const ADMIN_ROUTE_REGEX = /^\/admin(\/|$)/;

export const RouterBridge: React.FC<RouterBridgeProps> = ({ children }) => {
  const reactNavigate = useReactNavigate();
  const { toast } = useToast();

  // Check if a path is an admin route
  const isAdminRoute = useCallback((path: string): boolean => {
    return ADMIN_ROUTE_REGEX.test(path);
  }, []);

  // Unified navigation function that handles both router types
  const navigateTo = useCallback((path: string) => {
    try {
      console.log(`RouterBridge: Navigating to ${path}`);
      
      if (isAdminRoute(path)) {
        // For admin routes, we use TanStack Router
        console.log(`RouterBridge: Using TanStack Router for ${path}`);
        
        // If we're already in the admin section, use TanStack's navigate
        if (window.location.pathname.startsWith('/admin')) {
          adminRouter.navigate({ to: path });
        } else {
          // For transitions from non-admin to admin sections, use React Router
          // to ensure component lifecycle is properly handled
          reactNavigate('/admin', { replace: true });
          
          // After a short delay to ensure components are properly mounted
          setTimeout(() => {
            if (path !== '/admin') {
              adminRouter.navigate({ to: path, replace: true });
            }
          }, 10);
        }
      } else {
        // For non-admin routes, use React Router
        console.log(`RouterBridge: Using React Router for ${path}`);
        reactNavigate(path);
      }
    } catch (error) {
      console.error("Navigation error:", error);
      toast({
        variant: "destructive",
        title: "Navigation Error",
        description: error instanceof Error ? error.message : "Failed to navigate"
      });
    }
  }, [reactNavigate, isAdminRoute, toast]);

  return (
    <RouterBridgeContext.Provider value={{ navigateTo, isAdminRoute }}>
      {children}
    </RouterBridgeContext.Provider>
  );
};

// Custom hook to use the router bridge
export const useRouterBridge = () => {
  const context = React.useContext(RouterBridgeContext);
  if (!context) {
    throw new Error('useRouterBridge must be used within a RouterBridge provider');
  }
  return context;
};
