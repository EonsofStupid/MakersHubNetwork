
import React from 'react';
import { AdminThemeProvider } from './AdminThemeProvider';
import { useAdmin } from '@/admin/hooks/useAdmin';
import { ThemeDebugger } from './utils/ThemeDebugger';

interface AdminThemeWrapperProps {
  children: React.ReactNode;
}

export function AdminThemeWrapper({ children }: AdminThemeWrapperProps) {
  const { isDevMode } = useAdmin();

  return (
    <AdminThemeProvider>
      <div className="impulse-admin-root">
        {children}
        {isDevMode && <ThemeDebugger />}
      </div>
    </AdminThemeProvider>
  );
}
