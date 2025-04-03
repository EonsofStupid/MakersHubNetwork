
import React, { useEffect, useState } from 'react';
import { AdminThemeProvider as AdminThemeContextProvider } from './context/AdminThemeContext';
import { ThemeFallback } from './fallback/ThemeFallback';
import { applyThemeToDocument } from './utils/themeApplicator';
import { defaultImpulseTokens } from './impulse/tokens';
import { DynamicKeyframes } from './effects/DynamicKeyframes';
import { themeRegistry } from './ThemeRegistry';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import './impulse/impulse-admin.css';
import './impulse/impulse-theme.css';
import './impulse/impulse.css';

const logger = getLogger('AdminThemeProvider', { category: LogCategory.THEME });

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [isApplied, setIsApplied] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Apply immediate fallback styling and register the theme
  useEffect(() => {
    const registerAndApplyTheme = () => {
      try {
        // Apply fallback immediately to prevent white flash
        logger.debug('Registering and applying immediate fallback styling');
        
        // Register default theme if not already registered
        if (!isRegistered) {
          themeRegistry.registerTheme('default', defaultImpulseTokens);
          setIsRegistered(true);
        }
        
        // Apply the default theme immediately
        applyThemeToDocument(defaultImpulseTokens);
        
        // Add admin theme class to html element
        document.documentElement.classList.add('impulse-admin-root');
        document.documentElement.setAttribute('data-admin-theme', 'impulsivity');
        
        setIsApplied(true);
        logger.info('Admin theme fallback applied successfully');
      } catch (error) {
        logger.error('Failed to apply admin theme fallback', {
          details: { error: error instanceof Error ? error.message : 'Unknown error' }
        });
      }
    };
    
    // Execute immediately
    registerAndApplyTheme();
    
    return () => {
      // Clean up when component unmounts
      document.documentElement.classList.remove('impulse-admin-root');
      document.documentElement.removeAttribute('data-admin-theme');
      logger.debug('Admin theme cleanup on unmount');
    };
  }, [isRegistered]);

  // Return the provider with fallback and dynamic keyframes
  return (
    <>
      {/* Always apply fallback styles immediately */}
      <ThemeFallback />
      
      {/* Add dynamic keyframes for animations */}
      <DynamicKeyframes />
      
      {/* Then initialize the actual theme provider with proper context */}
      <AdminThemeContextProvider>
        {children}
      </AdminThemeContextProvider>
    </>
  );
}

// Re-export the hook for convenience
export { useAdminTheme } from './context/AdminThemeContext';
