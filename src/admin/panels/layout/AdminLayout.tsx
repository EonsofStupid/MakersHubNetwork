
import React from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from '@/rbac/bridge';
import { useLogger } from '@/hooks/use-logger';
import { LOG_CATEGORY } from '@/shared/types/shared.types';
import AdminTopNav from '../../components/navigation/AdminTopNav';

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Admin layout component that provides structure for admin pages
 * Includes header and sidebar navigation
 */
export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const logger = useLogger('AdminLayout', LOG_CATEGORY.ADMIN);
  
  // Check admin access
  const hasAdminAccess = RBACBridge.hasAdminAccess();
  
  // Log admin access
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (hasAdminAccess) {
        logger.info('Admin access granted', {
          details: {
            userId: user.id,
            email: user.email
          }
        });
      } else {
        logger.warn('User attempted to access admin area without proper permissions', {
          details: {
            userId: user.id,
            email: user.email
          }
        });
      }
    }
  }, [isAuthenticated, user, hasAdminAccess, logger]);
  
  // If not authenticated or no admin access, show access denied
  if (!isAuthenticated || !hasAdminAccess) {
    return (
      <div className="flex min-h-screen flex-col">
        <AdminTopNav />
        <div className="flex-1 p-8 bg-muted/10">
          <div className="max-w-md mx-auto bg-destructive/10 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold text-destructive mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access the admin area.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <AdminTopNav />
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
};
