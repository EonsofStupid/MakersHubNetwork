import React, { useEffect } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { adminRoutes } from '@/admin/routes';
import { createRouter, createRootRoute } from '@tanstack/react-router';
import { RouterProvider } from '@tanstack/react-router';

// Import admin-specific CSS
import '../admin/theme/impulse/impulse.css';
import '../admin/theme/impulse/impulse-admin.css';
import '../admin/theme/impulse/impulse-theme.css';

// Create a dedicated root route for admin to avoid collision
const adminRootRoute = createRootRoute({
  component: () => <AdminAppContent />
});

// Create a separate admin router to avoid route collision
const adminRouter = createRouter({
  routeTree: adminRootRoute.addChildren(adminRoutes),
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0
});

// Admin content wrapper component
function AdminAppContent() {
  const logger = useLogger('AdminContent', LogCategory.ADMIN);
  
  useEffect(() => {
    logger.info('Admin content mounted');
    return () => logger.info('Admin content unmounted');
  }, [logger]);
  
  return (
    <div className="admin-app-container">
      {/* AdminRoutes component handles auth checks and rendering Outlet */}
      <React.Suspense fallback={<AdminLoader />}>
        <RouterProvider router={adminRouter} />
      </React.Suspense>
    </div>
  );
}

// Admin loading component
function AdminLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
}

export default function Admin() {
  const logger = useLogger('AdminPage', LogCategory.ADMIN);
  
  useEffect(() => {
    logger.info('Admin page mounted');
    
    return () => {
      logger.info('Admin page unmounted');
    };
  }, [logger]);

  return <AdminAppContent />;
}
