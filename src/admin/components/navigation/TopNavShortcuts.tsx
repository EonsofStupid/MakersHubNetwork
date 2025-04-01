
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Plus, Search, Home, Settings, FileCode } from 'lucide-react';
import { AdminTooltip } from '@/admin/components/ui/AdminTooltip';
import { useAdminPermissions } from '@/admin/hooks/useAdminPermissions';
import { ADMIN_PERMISSIONS } from '@/admin/constants/permissions';

export function TopNavShortcuts() {
  const navigate = useNavigate();
  const { hasPermission } = useAdminPermissions();

  return (
    <div className="flex items-center space-x-1">
      <AdminTooltip content="Dashboard" side="bottom">
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="admin-topnav-item"
        >
          <Home className="w-5 h-5" />
        </button>
      </AdminTooltip>
      
      <Separator orientation="vertical" className="h-6 mx-1 bg-[var(--impulse-border-normal)]" />
      
      {hasPermission(ADMIN_PERMISSIONS.CONTENT_CREATE) && (
        <AdminTooltip content="Create New Content" side="bottom">
          <button 
            onClick={() => navigate('/admin/content/create')}
            className="admin-topnav-item"
          >
            <Plus className="w-5 h-5" />
          </button>
        </AdminTooltip>
      )}
      
      <AdminTooltip content="Search" side="bottom">
        <button 
          onClick={() => navigate('/admin/search')}
          className="admin-topnav-item"
        >
          <Search className="w-5 h-5" />
        </button>
      </AdminTooltip>
      
      {hasPermission(ADMIN_PERMISSIONS.SETTINGS_VIEW) && (
        <AdminTooltip content="Settings" side="bottom">
          <button 
            onClick={() => navigate('/admin/settings')}
            className="admin-topnav-item"
          >
            <Settings className="w-5 h-5" />
          </button>
        </AdminTooltip>
      )}
      
      {hasPermission(ADMIN_PERMISSIONS.SYSTEM_LOGS) && (
        <AdminTooltip content="System Logs" side="bottom">
          <button 
            onClick={() => navigate('/admin/logs')}
            className="admin-topnav-item"
          >
            <FileCode className="w-5 h-5" />
          </button>
        </AdminTooltip>
      )}
    </div>
  );
}
