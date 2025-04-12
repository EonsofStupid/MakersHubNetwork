
import React, { ReactNode } from 'react';
import { AdminLayout } from './AdminLayout';

interface ImpulseAdminLayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
  title?: string;
}

/**
 * Admin layout specifically for Impulse admin panels
 */
export function ImpulseAdminLayout({
  children,
  fullWidth = false,
  className = '',
  title
}: ImpulseAdminLayoutProps) {
  return (
    <AdminLayout fullWidth={fullWidth} className={className} title={title}>
      {children}
    </AdminLayout>
  );
}
