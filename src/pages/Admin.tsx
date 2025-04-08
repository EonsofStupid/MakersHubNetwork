
import React, { useEffect } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { AdminAuthGuard } from '@/admin/components/AdminAuthGuard';
import { AdminRoutes } from '@/admin/routes/AdminRoutes';

// Import admin-specific CSS
import '../admin/theme/impulse/impulse.css';
import '../admin/theme/impulse/impulse-admin.css';
import '../admin/theme/impulse/impulse-theme.css';

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

  return (
    <div className="admin-app-container">
      <AdminAuthGuard>
        <React.Suspense fallback={<AdminLoader />}>
          <AdminRoutes />
        </React.Suspense>
      </AdminAuthGuard>
    </div>
  );
}
