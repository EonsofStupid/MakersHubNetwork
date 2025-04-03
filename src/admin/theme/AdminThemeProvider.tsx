
import React, { useEffect, useState } from 'react';
import { AdminThemeProvider as AdminThemeContextProvider } from './context/AdminThemeContext';
import { ThemeFallback } from './fallback/ThemeFallback';
import { applyThemeToDocument } from './utils/themeApplicator';
import { defaultImpulseTokens } from './impulse/tokens';
import { DynamicKeyframes } from './effects/DynamicKeyframes';
import { themeRegistry } from './ThemeRegistry';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { usePerformanceLogger } from '@/hooks/use-performance-logger';
import './impulse/impulse-admin.css';
import './impulse/impulse-theme.css';
import './impulse/impulse.css';

const logger = getLogger('AdminThemeProvider', { category: LogCategory.THEME });

// Hard-coded fallback colors for critical styling
const FALLBACKS = {
  background: '#12121A',
  foreground: '#F6F6F7',
  primary: '#00F0FF',
  secondary: '#FF2D6E'
};

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [isApplied, setIsApplied] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const { measure } = usePerformanceLogger('AdminThemeProvider');

  // Apply immediate fallback styling and register the theme
  useEffect(() => {
    const registerAndApplyTheme = () => {
      measure('admin-theme-initial-setup', () => {
        try {
          // Apply fallback immediately to prevent white flash
          logger.debug('Registering and applying immediate fallback styling');
          
          // Force immediate style application to prevent flash
          document.documentElement.style.backgroundColor = FALLBACKS.background;
          document.documentElement.style.color = FALLBACKS.foreground;
          document.body.style.backgroundColor = FALLBACKS.background;
          document.body.style.color = FALLBACKS.foreground;
          
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
          
          // Set CSS variables directly for immediate effect
          document.documentElement.style.setProperty('--color-primary', '0, 240, 255');
          document.documentElement.style.setProperty('--color-secondary', '255, 45, 110');
          document.documentElement.style.setProperty('--impulse-primary', FALLBACKS.primary);
          document.documentElement.style.setProperty('--impulse-secondary', FALLBACKS.secondary);
          
          setIsApplied(true);
          logger.info('Admin theme fallback applied successfully');
        } catch (error) {
          logger.error('Failed to apply admin theme fallback', {
            details: { error: error instanceof Error ? error.message : 'Unknown error' }
          });
          
          // Emergency fallback on critical error
          try {
            document.documentElement.style.backgroundColor = FALLBACKS.background;
            document.documentElement.style.color = FALLBACKS.foreground;
          } catch (emergencyError) {
            // We've done all we can at this point
          }
        }
      });
    };
    
    // Execute immediately
    registerAndApplyTheme();
    
    return () => {
      // Clean up when component unmounts
      document.documentElement.classList.remove('impulse-admin-root');
      document.documentElement.removeAttribute('data-admin-theme');
      logger.debug('Admin theme cleanup on unmount');
    };
  }, [isRegistered, measure]);

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
