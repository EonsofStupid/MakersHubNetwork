
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminLayout } from '@/admin/components/AdminLayout';

/**
 * ImpulseAdminLayout - A specialized version of AdminLayout for the Impulse theme
 * 
 * This is a wrapper around AdminLayout that adds Impulse-specific styling and functionality
 */
export function ImpulseAdminLayout({ 
  title = "Impulse Admin",
  children
}: { 
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <AdminLayout title={title} className="impulse-admin-layout">
      {children}
    </AdminLayout>
  );
}
