
import React, { ReactNode } from 'react';
import { AdminLayout } from './AdminLayout';

interface ImpulseAdminLayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

/**
 * Admin layout specifically for Impulse admin panels
 */
export function ImpulseAdminLayout({
  children,
  fullWidth = false,
  className = ''
}: ImpulseAdminLayoutProps) {
  return (
    <AdminLayout fullWidth={fullWidth} className={className}>
      {children}
    </AdminLayout>
  );
}
