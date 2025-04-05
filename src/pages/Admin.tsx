
import React, { useEffect } from 'react';
import { AdminRoutes } from '@/admin/routes';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import '../admin/theme/impulse/impulse.css';
import '../admin/theme/impulse/impulse-admin.css';
import '../admin/theme/impulse/impulse-theme.css';

export default function Admin() {
  const logger = useLogger('AdminPage', LogCategory.ADMIN);
  
  useEffect(() => {
    logger.info('Admin page mounted');
    
    return () => {
      logger.info('Admin page unmounted');
    };
  }, [logger]);

  return <AdminRoutes />;
}
