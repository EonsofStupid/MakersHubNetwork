
import React from 'react';
import { AdminLayout } from '@/admin/components/AdminLayout';

interface ImpulseAdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function ImpulseAdminLayout({ 
  children, 
  title = "Admin Dashboard", 
  className 
}: ImpulseAdminLayoutProps) {
  return (
    <AdminLayout title={title} className={className}>
      {children}
    </AdminLayout>
  );
}
