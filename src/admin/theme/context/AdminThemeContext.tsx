
import React, { createContext, useContext, useState } from 'react';
import { defaultImpulseTokens } from '../impulse/tokens';
import { useAdminTheme as useAdminThemeHook } from '../hooks/useAdminTheme';

// Create context with default values
const AdminThemeContext = createContext<ReturnType<typeof useAdminThemeHook>>({
  currentTheme: null,
  componentStyles: {},
  isLoading: false,
  utilityClasses: {},
  impulseTheme: defaultImpulseTokens
});

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const themeValues = useAdminThemeHook();
  
  return (
    <AdminThemeContext.Provider value={themeValues}>
      {children}
    </AdminThemeContext.Provider>
  );
}

// Hook to use admin theme context
export function useAdminTheme() {
  return useContext(AdminThemeContext);
}
