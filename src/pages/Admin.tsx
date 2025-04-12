
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';
import { AdminLayout } from '@/admin/components/layouts/AdminLayout';
import { AdminAuthGuard } from '@/admin/components/AdminAuthGuard';
import { OverviewDashboard } from '@/admin/features/overview/OverviewDashboard';

export default function Admin() {
  const logger = useLogger('AdminPage', LogCategory.ADMIN);

  React.useEffect(() => {
    logger.info('Admin page mounted');
  }, [logger]);

  return (
    <AdminAuthGuard>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<OverviewDashboard />} />
          <Route path="users" element={<div>User Management</div>} />
          <Route path="content" element={<div>Content Management</div>} />
          <Route path="settings" element={<div>Settings</div>} />
          <Route path="system" element={<div>System Controls</div>} />
          <Route path="themes" element={<div>Theme Editor</div>} />
          <Route path="logs" element={<div>System Logs</div>} />
          <Route path="*" element={<div>Not Found</div>} />
        </Route>
      </Routes>
    </AdminAuthGuard>
  );
}
