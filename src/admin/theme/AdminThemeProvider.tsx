
import React from 'react';
import { AdminThemeProvider as AdminThemeContextProvider } from './context/AdminThemeContext';

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <AdminThemeContextProvider>
      {children}
    </AdminThemeContextProvider>
  );
}

// Re-export the hook for convenience
export { useAdminTheme } from './context/AdminThemeContext';
