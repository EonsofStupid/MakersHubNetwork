
import React, { ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminProvider } from '../context/AdminContext';
import { cn } from '@/shared/utils/cn';
import { useAdminSidebar } from '../hooks/useAdminSidebar';
import { RequireAuth } from '@/auth/components/RequireAuth';
import { RequirePermission } from '@/auth/components/RequirePermission';
import { ADMIN_PERMISSIONS } from '@/admin/constants/permissions';

interface AdminLayoutProps {
  children: ReactNode;
  className?: string;
}

export function AdminLayout({ children, className }: AdminLayoutProps) {
  const { isOpen } = useAdminSidebar();

  return (
    <RequireAuth redirectTo="/auth">
      <RequirePermission
        permission={ADMIN_PERMISSIONS.VIEW_ADMIN_PANEL}
        fallback={<div>You don't have permission to access this area.</div>}
      >
        <AdminProvider>
          <div className="flex h-screen flex-col overflow-hidden">
            <AdminHeader />
            <div className="flex flex-1 overflow-hidden">
              <AdminSidebar className="hidden lg:block" />
              <main
                className={cn(
                  'flex-1 overflow-y-auto transition-all',
                  isOpen ? 'lg:pl-64' : 'lg:pl-0',
                  className
                )}
              >
                {children}
              </main>
            </div>
          </div>
        </AdminProvider>
      </RequirePermission>
    </RequireAuth>
  );
}
