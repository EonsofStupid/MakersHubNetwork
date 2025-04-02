
import React, { useEffect } from 'react';
import { AdminThemeProvider as AdminThemeContextProvider } from './context/AdminThemeContext';
import { ThemeFallback } from './fallback/ThemeFallback';
import { applyThemeToDocument } from './utils/themeUtils';
import { defaultImpulseTokens } from './impulse/tokens';

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  // Apply immediate fallback styling
  useEffect(() => {
    applyThemeToDocument(defaultImpulseTokens);
  }, []);

  return (
    <>
      {/* Always apply fallback styles immediately */}
      <ThemeFallback />
      
      {/* Then initialize the actual theme provider */}
      <AdminThemeContextProvider>
        {children}
      </AdminThemeContextProvider>
    </>
  );
}

// Re-export the hook for convenience
export { useAdminTheme } from './context/AdminThemeContext';
