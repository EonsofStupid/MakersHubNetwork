
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
    <div className={`admin-impulse-layout ${fullWidth ? 'w-full' : 'max-w-screen-xl mx-auto'} ${className}`}>
      <h1 className="text-2xl font-bold mb-6">{title || 'Admin Panel'}</h1>
      {children}
    </div>
  );
}
