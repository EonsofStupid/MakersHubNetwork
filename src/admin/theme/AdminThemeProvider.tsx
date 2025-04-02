
import React, { useEffect, useState } from 'react';
import { AdminThemeProvider as AdminThemeContextProvider } from './context/AdminThemeContext';
import { ThemeFallback } from './fallback/ThemeFallback';
import { applyThemeToDocument } from './utils/themeUtils';
import { defaultImpulseTokens } from './impulse/tokens';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { DynamicKeyframes } from './effects/DynamicKeyframes';
import './impulse/impulse-admin.css';
import './impulse/impulse-theme.css';
import './impulse/impulse.css';

const logger = getLogger('AdminThemeProvider', LogCategory.THEME);

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [isApplied, setIsApplied] = useState(false);

  // Apply immediate fallback styling
  useEffect(() => {
    // Apply fallback immediately to prevent white flash
    logger.debug('Applying immediate fallback styling');
    applyThemeToDocument(defaultImpulseTokens);
    
    // Add admin theme class to html element
    document.documentElement.classList.add('impulse-admin-root');
    document.documentElement.setAttribute('data-admin-theme', 'impulsivity');
    
    setIsApplied(true);
    
    return () => {
      // Clean up when component unmounts
      document.documentElement.classList.remove('impulse-admin-root');
      document.documentElement.removeAttribute('data-admin-theme');
    };
  }, []);

  return (
    <>
      {/* Always apply fallback styles immediately */}
      <ThemeFallback />
      
      {/* Add dynamic keyframes for animations */}
      <DynamicKeyframes />
      
      {/* Then initialize the actual theme provider */}
      <AdminThemeContextProvider>
        {children}
      </AdminThemeContextProvider>
    </>
  );
}

// Re-export the hook for convenience
export { useAdminTheme } from './context/AdminThemeContext';
