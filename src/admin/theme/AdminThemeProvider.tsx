
import React, { useEffect, useState } from 'react';
import { AdminThemeProvider as AdminThemeContextProvider } from './context/AdminThemeContext';
import { ThemeFallback } from './fallback/ThemeFallback';
import { 
  applyThemeToDocument, 
  createFallbackStyles, 
  applyEmergencyTheme,
  verifyThemeApplication
} from './utils/themeApplicator';
import { defaultImpulseTokens } from '@/admin/types/impulse.types';
import { DynamicKeyframes } from './effects/DynamicKeyframes';
import { themeRegistry } from './ThemeRegistry';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { usePerformanceLogger } from '@/hooks/use-performance-logger';
import { useThemeStore } from '@/stores/theme/store';
import { safeDetails } from '@/logging/utils/safeDetails';
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

/**
 * The main AdminThemeProvider that handles application of theme values
 * to the document and provides theme context to child components.
 */
export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [isApplied, setIsApplied] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const { measure } = usePerformanceLogger('AdminThemeProvider');
  const { currentTheme, hydrateTheme } = useThemeStore();

  // Apply emergency theme IMMEDIATELY before any other operations
  useEffect(() => {
    // Create and inject fallback styles first thing - these will apply
    // even if JS fails later
    createFallbackStyles();
  }, []);

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
            try {
              // Safety check - ensure the defaultImpulseTokens has the expected structure
              const hasValidStructure = defaultImpulseTokens && 
                typeof defaultImpulseTokens === 'object' &&
                defaultImpulseTokens.colors &&
                typeof defaultImpulseTokens.colors === 'object';
                
              if (!hasValidStructure) {
                logger.error('Default theme tokens have invalid structure', { 
                  details: { tokens: defaultImpulseTokens } 
                });
                // Apply emergency theme if tokens are invalid
                applyEmergencyTheme();
              } else {
                // Register theme properly
                themeRegistry.registerTheme('default', defaultImpulseTokens);
                setIsRegistered(true);
                logger.debug('Default theme registered with registry');
              }
            } catch (registerError) {
              logger.error('Failed to register default theme', { 
                details: safeDetails(registerError) 
              });
              applyEmergencyTheme();
            }
          }
          
          // Apply the default theme immediately
          try {
            applyThemeToDocument(defaultImpulseTokens);
            logger.debug('Default theme applied via applyThemeToDocument');
          } catch (applyError) {
            logger.error('Failed to apply default theme', { 
              details: safeDetails(applyError) 
            });
            applyEmergencyTheme();
          }
          
          // Add admin theme class to html element
          document.documentElement.classList.add('impulse-admin-root');
          document.documentElement.setAttribute('data-admin-theme', 'impulsivity');
          
          // Set CSS variables directly for immediate effect
          document.documentElement.style.setProperty('--color-primary', FALLBACKS.primary);
          document.documentElement.style.setProperty('--color-secondary', FALLBACKS.secondary);
          document.documentElement.style.setProperty('--color-accent', FALLBACKS.accent);
          document.documentElement.style.setProperty('--color-success', FALLBACKS.success);
          document.documentElement.style.setProperty('--color-warning', FALLBACKS.warning);
          document.documentElement.style.setProperty('--color-error', FALLBACKS.error);
          document.documentElement.style.setProperty('--impulse-primary', FALLBACKS.primary);
          document.documentElement.style.setProperty('--impulse-secondary', FALLBACKS.secondary);
          document.documentElement.style.setProperty('--impulse-accent', FALLBACKS.accent);
          document.documentElement.style.setProperty('--impulse-success', FALLBACKS.success);
          document.documentElement.style.setProperty('--impulse-warning', FALLBACKS.warning);
          document.documentElement.style.setProperty('--impulse-error', FALLBACKS.error);
          
          // Add RGB versions
          document.documentElement.style.setProperty('--color-primary-rgb', '0, 240, 255');
          document.documentElement.style.setProperty('--color-secondary-rgb', '255, 45, 110');
          document.documentElement.style.setProperty('--color-accent-rgb', '139, 92, 246');
          
          // Add essential keyframes
          addEssentialKeyframes();
          
          setIsApplied(true);
          logger.info('Admin theme fallback applied successfully');
          
          // Verify theme was applied correctly
          if (!verifyThemeApplication()) {
            logger.warn('Theme verification failed, applying emergency theme');
            applyEmergencyTheme();
          }
        } catch (error) {
          logger.error('Failed to apply admin theme fallback', {
            details: { error: error instanceof Error ? error.message : 'Unknown error' }
          });
          
          // Emergency fallback on critical error
          try {
            applyEmergencyTheme();
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
    
    // Also ensure theme is hydrated from the store
    if (!currentTheme) {
      try {
        hydrateTheme().catch(err => {
          logger.error('Failed to hydrate theme from store', { 
            details: safeDetails(err) 
          });
        });
      } catch (hydrateError) {
        logger.error('Unhandled error hydrating theme', { 
          details: safeDetails(hydrateError) 
        });
      }
    }
    
    return () => {
      // Clean up when component unmounts
      document.documentElement.classList.remove('impulse-admin-root');
      document.documentElement.removeAttribute('data-admin-theme');
      logger.debug('Admin theme cleanup on unmount');
    };
  }, [isRegistered, measure, currentTheme, hydrateTheme]);

  // Add essential keyframes for basic animations before the DynamicKeyframes component loads
  const addEssentialKeyframes = () => {
    try {
      // Check if essential keyframes already exist
      if (document.getElementById('essential-admin-keyframes')) {
        return;
      }
      
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
      logger.error('Failed to add essential keyframes', { 
        details: safeDetails(error) 
      });
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
