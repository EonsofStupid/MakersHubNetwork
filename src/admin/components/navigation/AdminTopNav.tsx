
import React from 'react';
import { Button } from '@/shared/ui/button';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from '@/rbac/bridge';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory, LogLevel } from '@/shared/types/shared.types';

const AdminTopNav = () => {
  const logger = useLogger('AdminTopNav', LogCategory.ADMIN);
  const user = useAuthStore(state => state.user);

  React.useEffect(() => {
    logger.debug('AdminTopNav mounted', {
      details: { 
        isAdmin: RBACBridge.hasAdminAccess(),
        roles: RBACBridge.getRoles()
      }
    });
  }, [logger]);

  const handleLogout = async () => {
    try {
      await useAuthStore.getState().logout();
      logger.info('Admin logged out successfully');
    } catch (error) {
      logger.error('Error logging out', { details: { error } });
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-background border-b">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <nav className="hidden md:flex items-center space-x-4">
          <a href="/admin" className="text-sm hover:text-primary">Dashboard</a>
          <a href="/admin/users" className="text-sm hover:text-primary">Users</a>
          <a href="/admin/content" className="text-sm hover:text-primary">Content</a>
          <a href="/admin/settings" className="text-sm hover:text-primary">Settings</a>
        </nav>
      </div>
      
      <div className="flex items-center gap-2">
        {user && (
          <span className="text-sm">{user.email}</span>
        )}
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminTopNav;
