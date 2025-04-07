
import React, { Suspense, useEffect } from 'react';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useAdminAccess } from '@/admin/hooks/useAdminAccess';
import { useThemeStore } from '@/stores/theme/themeStore';
import { adminRoutes } from './index';
import { commonSearchParamsSchema } from '@/router/searchParams';

// Loading component for lazy-loaded routes
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

export function AdminRoutes() {
  const logger = useLogger('AdminRoutes', LogCategory.ADMIN);
  const navigate = useNavigate();
  const { hasAdminAccess, isAuthenticated, isLoading: authLoading } = useAdminAccess();
  const { loadStatus } = useThemeStore();
  const themeLoading = loadStatus === 'loading';
  
  useEffect(() => {
    logger.info('Admin routes initialized', {
      details: {
        hasAdminAccess,
        isAuthenticated,
        authLoading,
        themeLoading,
        themeStatus: loadStatus
      }
    });
    
    // Automatically redirect to dashboard if on /admin root
    if (location.pathname === '/admin') {
      navigate({ to: 'admin/dashboard' });
    }
    
    // Redirect unauthorized users
    if (!authLoading && isAuthenticated && !hasAdminAccess) {
      logger.warn('Unauthorized access attempt to admin routes', {
        details: { path: location.pathname }
      });
      navigate({ to: 'admin/unauthorized' });
    }
    
    // Redirect unauthenticated users
    if (!authLoading && !isAuthenticated) {
      logger.warn('Unauthenticated access attempt to admin routes', {
        details: { path: location.pathname }
      });
      
      navigate({ 
        to: '/login',
        search: { returnTo: location.pathname }
      });
    }
  }, [logger, isAuthenticated, hasAdminAccess, authLoading, navigate, loadStatus]);
  
  // Show a loading state while checking permissions
  if (authLoading) {
    return <PageLoader />;
  }
  
  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
}

// Export the routes for registration
export { adminRoutes };
