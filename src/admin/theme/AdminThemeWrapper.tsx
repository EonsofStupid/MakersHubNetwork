
import React from 'react';
import { AdminThemeProvider } from './AdminThemeProvider';

interface AdminThemeWrapperProps {
  children: React.ReactNode;
}

export function AdminThemeWrapper({ children }: AdminThemeWrapperProps) {
  return (
    <AdminThemeProvider>
      <div className="impulse-admin-root">
        {children}
      </div>
    </AdminThemeProvider>
  );
}
