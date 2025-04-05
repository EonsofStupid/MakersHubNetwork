
import React from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { AdminDashboard } from '@/admin/components/dashboard/AdminDashboard';

export default function Dashboard() {
  const logger = useLogger('AdminDashboardPage', LogCategory.ADMIN);
  
  React.useEffect(() => {
    logger.info('Admin Dashboard page mounted');
    
    return () => {
      logger.info('Admin Dashboard page unmounted');
    };
  }, [logger]);

  return <AdminDashboard />;
}
