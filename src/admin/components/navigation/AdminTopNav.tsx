
import React from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from '@/rbac/bridge';
import { UserAvatar } from '@/shared/ui/UserAvatar';
import { Button } from '@/shared/ui/button';
import { LogCategory, LogLevel } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

interface AdminTopNavProps {
  onToggleSidebar?: () => void;
  className?: string;
}

/**
 * Admin top navigation bar
 */
const AdminTopNav: React.FC<AdminTopNavProps> = ({ 
  onToggleSidebar,
  className = ''
}) => {
  const { user, logout } = useAuthStore();
  const roles = RBACBridge.getRoles();
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Logout failed', { error });
    }
  };

  return (
    <header className={`bg-card p-4 flex items-center justify-between border-b ${className}`}>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="lg:hidden mr-2"
          aria-label="Toggle sidebar"
        >
          <MenuIcon />
        </Button>
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {RBACBridge.isSuperAdmin() && (
          <span className="text-sm bg-yellow-500 text-black px-2 py-1 rounded">
            Super Admin
          </span>
        )}
        
        <div className="flex items-center gap-2">
          <UserAvatar user={user} size="sm" />
          <div className="hidden md:block">
            <div className="text-sm font-medium">{user?.name || user?.email}</div>
            <div className="text-xs text-gray-500">{roles.join(', ')}</div>
          </div>
        </div>
        
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOutIcon className="w-4 h-4 mr-2" />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
};

// Icons
const MenuIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const LogOutIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default AdminTopNav;
