
import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopNav } from './navigation/AdminTopNav';
import { RequirePermission } from './auth/RequirePermission';
import { ADMIN_PERMISSIONS } from '@/admin/constants/permissions';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  fullWidth?: boolean;
  className?: string;
}

export function AdminLayout({ 
  children, 
  title = 'Admin Dashboard',
  fullWidth = false,
  className 
}: AdminLayoutProps) {
  return (
    <RequirePermission permission={ADMIN_PERMISSIONS.ADMIN_ACCESS}>
      <div className="min-h-screen flex w-full">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Top navigation */}
          <AdminTopNav title={title} />
          
          {/* Main content area */}
          <div 
            className={cn(
              "flex-1 overflow-auto p-6",
              fullWidth ? "max-w-full" : "max-w-7xl mx-auto",
              className
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </RequirePermission>
  );
}
