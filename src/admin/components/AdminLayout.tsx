import React from 'react';
import { useAdminAuth } from '@/admin/hooks/useAdminAuth';
import { useRbac } from '@/auth/rbac/use-rbac';
import { AdminHeader } from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';
import { AdminAuthGuard } from './AdminAuthGuard';

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Admin layout component that provides structure for admin pages
 * Includes header and sidebar
 */
export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAdminAuth();
  const { hasAdminAccess } = useRbac();
  const logger = useLogger('AdminLayout', LogCategory.ADMIN);
  
  // Log admin access
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (hasAdminAccess()) {
        logger.info('Admin access granted', {
          details: {
            userId: user.id,
            roles: user.roles
          }
        });
      } else {
        logger.warn('User attempted to access admin area without proper permissions', {
          details: {
            userId: user.id,
            roles: user.roles
          }
        });
      }
    }
  }, [isAuthenticated, user, hasAdminAccess, logger]);
  
  return (
    <AdminAuthGuard>
      <div className="admin-layout">
        <AdminHeader />
        <div className="admin-content">
          <AdminSidebar />
          <main className="admin-main">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
};
