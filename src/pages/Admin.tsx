
import React, { useEffect, Suspense } from 'react';
import { AdminRoutes } from '@/admin/routes';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';
import '../admin/theme/impulse/impulse.css';
import '../admin/theme/impulse/impulse-admin.css';
import '../admin/theme/impulse/impulse-theme.css';

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-background">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading admin panel...</p>
    </div>
  </div>
);

export default function Admin() {
  const logger = useLogger('AdminPage', { category: LogCategory.ADMIN });
  
  useEffect(() => {
    logger.info('Admin page mounted');
    
    return () => {
      logger.info('Admin page unmounted');
    };
  }, [logger]);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdminRoutes />
    </Suspense>
  );
}
