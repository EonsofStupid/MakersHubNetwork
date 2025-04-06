
import { useEffect, useState, useRef } from 'react';
import { useImpulsivityTheme } from '@/hooks/useImpulsivityTheme';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { Loader } from 'lucide-react';
import { useThemeStore } from '@/stores/theme/store';
import { ThemeLogDetails } from '@/types/theme';

interface ImpulsivityInitProps {
  autoApply?: boolean;
  children?: React.ReactNode;
  showLoader?: boolean;
}

export function ImpulsivityInit({ autoApply = true, children, showLoader = false }: ImpulsivityInitProps) {
  const { applyTheme, applyToMainSite, isSyncing } = useImpulsivityTheme();
  const { isLoading: themeStoreLoading } = useThemeStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isError, setIsError] = useState(false);
  const logger = useLogger('ImpulsivityInit', LogCategory.UI);
  const initAttempted = useRef(false);
  
  // Function to apply the critical CSS variables directly
  const applyDirectCSSVariables = () => {
    try {
      // Apply immediate styles for fast visual feedback - CRITICAL
      const rootElement = document.documentElement;
      
      // Primary colors
      rootElement.style.setProperty('--site-primary', '186 100% 50%'); // #00F0FF in HSL  
      rootElement.style.setProperty('--site-secondary', '334 100% 59%'); // #FF2D6E in HSL
      
      // Effect colors (direct hex values for maximum compatibility)
      rootElement.style.setProperty('--site-effect-color', '#00F0FF');
      rootElement.style.setProperty('--site-effect-secondary', '#FF2D6E');
      rootElement.style.setProperty('--site-effect-tertiary', '#8B5CF6');
      
      // Background and text colors
      rootElement.style.setProperty('--site-background', '228 47% 8%'); // #080F1E in HSL
      rootElement.style.setProperty('--site-foreground', '210 40% 98%'); // #F9FAFB in HSL
      rootElement.style.setProperty('--site-card', '228 47% 11%');
      rootElement.style.setProperty('--site-card-foreground', '210 40% 98%');
      
      // Standard variants (convert HSL to regular CSS variables for direct use)
      rootElement.style.setProperty('--background', 'hsl(228 47% 8%)'); // #080F1E in HSL
      rootElement.style.setProperty('--foreground', 'hsl(210 40% 98%)'); // #F9FAFB in HSL
      rootElement.style.setProperty('--card', 'hsl(228 47% 11%)');
      rootElement.style.setProperty('--primary', 'hsl(186 100% 50%)');
      rootElement.style.setProperty('--secondary', 'hsl(334 100% 59%)');
      
      // Direct fallback hex values
      rootElement.style.setProperty('--impulse-primary', '#00F0FF');
      rootElement.style.setProperty('--impulse-secondary', '#FF2D6E');
      rootElement.style.setProperty('--impulse-bg-main', '#080F1E');
      rootElement.style.setProperty('--impulse-text-primary', '#F9FAFB');
      
      // Add theme class to the HTML element
      rootElement.classList.add('theme-impulsivity');
      document.body.classList.add('theme-impulsivity-body');
      
      logger.info('Applied direct CSS variables for Impulsivity theme');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const logDetails: ThemeLogDetails = { 
        errorMessage
      };
      
      logger.error('Error applying direct CSS variables', logDetails);
      return false;
    }
  };
  
  useEffect(() => {
    // Always apply direct CSS variables first for immediate visual feedback
    applyDirectCSSVariables();
    
    // Only initialize once to prevent infinite loops
    if (autoApply && !isInitialized && !isSyncing && !themeStoreLoading && !initAttempted.current) {
      const initTheme = async () => {
        try {
          initAttempted.current = true;
          logger.info('Initializing Impulsivity theme');
          setIsError(false);
          
          // Ensure CSS variables are applied immediately
          applyDirectCSSVariables();
          
          try {
            // Try to apply to the main site first - most critical
            const mainSiteResult = await applyToMainSite();
            
            // Only attempt the full theme system application if the main site succeeded
            if (mainSiteResult) {
              // Then try the full theme application
              await applyTheme();
            }
            
            // Mark as initialized regardless, we've applied the direct styles already
            setIsInitialized(true);
            logger.info('Impulsivity theme initialization complete');
          } catch (error) {
            // Even if we fail, we've already applied the direct CSS variables
            // so we can mark as initialized to let the app continue
            setIsInitialized(true);
            setIsError(true);
            
            const errorMessage = error instanceof Error 
              ? error.message 
              : 'Unknown error initializing theme';
            
            const logDetails: ThemeLogDetails = { 
              errorMessage
            };
            
            logger.warn('Impulsivity theme initialization incomplete', logDetails);
            
            // Ensure we reapply direct styles after error
            applyDirectCSSVariables();
          }
        } catch (error) {
          setIsError(true);
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'Unknown error initializing theme';
          
          const logDetails: ThemeLogDetails = { 
            errorMessage
          };
          
          logger.error('Failed to initialize Impulsivity theme', logDetails);
          
          // Apply direct CSS variables as ultimate fallback
          applyDirectCSSVariables();
          
          // Still mark as initialized to avoid blocking the app
          setIsInitialized(true);
        }
      };
      
      initTheme();
    }
    
    // Emergency timeout - reduced to 1 second to ensure app is responsive
    const timeout = setTimeout(() => {
      if (!isInitialized) {
        logger.warn('Impulsivity theme initialization timed out, continuing anyway');
        setIsInitialized(true);
        
        // Reapply direct CSS variables as fallback
        applyDirectCSSVariables();
      }
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [autoApply, applyTheme, applyToMainSite, isInitialized, logger, isSyncing, themeStoreLoading]);
  
  // If showing loader and still initializing, render a loading indicator
  if (showLoader && !isInitialized) {
    return (
      <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-card p-6 rounded-lg shadow-lg border border-border flex flex-col items-center">
          <Loader className="animate-spin h-8 w-8 text-primary mb-4" />
          <p className="text-foreground font-medium">Initializing Theme...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}
