
import React from 'react';
import { AdminLayout } from '@/admin/components/layouts/AdminLayout';
import { cn } from '@/lib/utils';

interface ImpulseAdminLayoutProps {
  children?: React.ReactNode;
  title?: string;
  fullWidth?: boolean;
  className?: string;
}

export function ImpulseAdminLayout({ 
  children, 
  title = 'Admin Dashboard',
  fullWidth = false,
  className 
}: ImpulseAdminLayoutProps) {
  return (
    <AdminLayout 
      title={title}
      fullWidth={fullWidth}
      className={cn("impulse-admin-content", className)}
    >
      {children}
    </AdminLayout>
  );
}
