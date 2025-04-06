
import React, { Suspense } from 'react';
import { adminRoutes } from './index';
import { Outlet } from '@tanstack/react-router';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

// Loading component for lazy-loaded routes
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

export function AdminRoutes() {
  const logger = useLogger('AdminRoutes', LogCategory.ADMIN);
  
  React.useEffect(() => {
    logger.info('Admin routes initialized');
  }, [logger]);
  
  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
}

// Export the routes for registration
export { adminRoutes };
