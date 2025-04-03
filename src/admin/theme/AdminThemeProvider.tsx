
import React, { useEffect, useState } from 'react';
import { AdminThemeProvider as AdminThemeContextProvider } from './context/AdminThemeContext';
import { ThemeFallback } from './fallback/ThemeFallback';
import { applyThemeToDocument } from './utils/themeApplicator';
import { defaultImpulseTokens } from './impulse/tokens';
import { DynamicKeyframes } from './effects/DynamicKeyframes';
import { themeRegistry } from './ThemeRegistry';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
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
  secondary: '#FF2D6E',
  accent: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444'
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
          logger.info('Registering and applying immediate fallback styling');
          
          // Force immediate style application to prevent flash
          document.documentElement.style.backgroundColor = FALLBACKS.background;
          document.documentElement.style.color = FALLBACKS.foreground;
          document.body.style.backgroundColor = FALLBACKS.background;
          document.body.style.color = FALLBACKS.foreground;
          
          // Register default theme if not already registered
          if (!isRegistered) {
            themeRegistry.registerTheme('default', defaultImpulseTokens);
            setIsRegistered(true);
            logger.debug('Default theme registered with registry');
          }
          
          // Apply the default theme immediately
          applyThemeToDocument(defaultImpulseTokens);
          
          // Add admin theme class to html element
          document.documentElement.classList.add('impulse-admin-root');
          document.documentElement.setAttribute('data-admin-theme', 'impulsivity');
          
          // Set CSS variables directly for immediate effect
          document.documentElement.style.setProperty('--color-primary', '0, 240, 255');
          document.documentElement.style.setProperty('--color-secondary', '255, 45, 110');
          document.documentElement.style.setProperty('--color-accent', '139, 92, 246');
          document.documentElement.style.setProperty('--color-success', '16, 185, 129');
          document.documentElement.style.setProperty('--color-warning', '245, 158, 11');
          document.documentElement.style.setProperty('--color-error', '239, 68, 68');
          document.documentElement.style.setProperty('--impulse-primary', FALLBACKS.primary);
          document.documentElement.style.setProperty('--impulse-secondary', FALLBACKS.secondary);
          document.documentElement.style.setProperty('--impulse-accent', FALLBACKS.accent);
          document.documentElement.style.setProperty('--impulse-success', FALLBACKS.success);
          document.documentElement.style.setProperty('--impulse-warning', FALLBACKS.warning);
          document.documentElement.style.setProperty('--impulse-error', FALLBACKS.error);
          
          // Add keyframes for essential animations
          addEssentialKeyframes();
          
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
            document.documentElement.classList.add('impulse-admin-root');
            document.documentElement.setAttribute('data-admin-theme', 'fallback');
          } catch (emergencyError) {
            // We've done all we can at this point
            logger.error('Critical theme fallback error', { 
              details: { error: emergencyError instanceof Error ? emergencyError.message : 'Unknown error' }
            });
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

  // Add essential keyframes for basic animations before the DynamicKeyframes component loads
  const addEssentialKeyframes = () => {
    try {
      const style = document.createElement('style');
      style.id = 'essential-admin-keyframes';
      style.textContent = `
        @keyframes admin-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes admin-glow-pulse {
          0%, 100% { box-shadow: 0 0 5px ${FALLBACKS.primary}; }
          50% { box-shadow: 0 0 20px ${FALLBACKS.primary}; }
        }
        
        @keyframes admin-scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .admin-animate-fade-in { animation: admin-fade-in 0.3s ease-out forwards; }
        .admin-animate-glow-pulse { animation: admin-glow-pulse 2s ease-in-out infinite; }
        .admin-animate-scale-in { animation: admin-scale-in 0.3s ease-out forwards; }
      `;
      document.head.appendChild(style);
      logger.debug('Essential admin keyframes added');
    } catch (error) {
      logger.error('Failed to add essential keyframes', { details: { error } });
    }
  };

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
