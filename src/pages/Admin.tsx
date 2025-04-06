
import React, { useEffect } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { adminRoutes } from '@/admin/routes';
import { createRouter } from '@tanstack/react-router';
import { RouterProvider } from '@tanstack/react-router';
import { rootRoute } from '@/router';

// Import admin-specific CSS
import '../admin/theme/impulse/impulse.css';
import '../admin/theme/impulse/impulse-admin.css';
import '../admin/theme/impulse/impulse-theme.css';

// Create a separate admin router to avoid route collision
const adminRouter = createRouter({
  routeTree: rootRoute.addChildren(adminRoutes),
  // Use the same options as the main router
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
});

export default function Admin() {
  const logger = useLogger('AdminPage', LogCategory.ADMIN);
  
  useEffect(() => {
    logger.info('Admin page mounted');
    
    return () => {
      logger.info('Admin page unmounted');
    };
  }, [logger]);

  // Use the admin-specific router
  return <RouterProvider router={adminRouter} />;
}
