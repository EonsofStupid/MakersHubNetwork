
import React from 'react';
import { LogsDashboard } from '@/admin/components/dashboard/LogsDashboard';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/constants/logLevel';
import { AdminPageHeader } from '@/admin/components/ui/AdminPageHeader';
import { LogConsole } from '@/logging/components/LogConsole';

/**
 * Admin Logs page
 */
export default function LogsPage() {
  const logger = useLogger('LogsPage', { category: LogCategory.ADMIN });
  
  logger.info('Admin logs page loaded');
  
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="System Logs"
        description="View and analyze system logs"
        icon="Activity"
      />
      
      <div className="grid grid-cols-1 gap-6">
        <LogsDashboard />
        <LogConsole hideIfEmpty={false} maxHeight="500px" />
      </div>
    </div>
  );
}
