
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
  const { applyTheme, isSyncing } = useImpulsivityTheme();
  const { isLoading: themeStoreLoading } = useThemeStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isError, setIsError] = useState(false);
  const logger = useLogger('ImpulsivityInit', LogCategory.UI);
  const initAttempted = useRef(false);
  
  useEffect(() => {
    // Apply immediate styles to ensure something is visible
    const applyImmediateStyles = () => {
      // Set essential CSS variables directly for fast visual feedback
      const rootElement = document.documentElement;
      rootElement.style.setProperty('--site-primary', '186 100% 50%'); // #00F0FF in HSL  
      rootElement.style.setProperty('--site-secondary', '334 100% 59%'); // #FF2D6E in HSL
      rootElement.style.setProperty('--site-effect-color', '#00F0FF');
      rootElement.style.setProperty('--site-effect-secondary', '#FF2D6E');
      rootElement.style.setProperty('--site-background', '#080F1E');
      rootElement.style.setProperty('--site-foreground', '#F9FAFB');
    };
    
    // Apply immediate styles regardless of theme system state
    applyImmediateStyles();
    
    // Only initialize once to prevent infinite loops
    if (autoApply && !isInitialized && !isSyncing && !themeStoreLoading && !initAttempted.current) {
      const initTheme = async () => {
        try {
          initAttempted.current = true;
          logger.info('Initializing Impulsivity theme');
          setIsError(false);
          
          const result = await applyTheme();
          
          if (result) {
            setIsInitialized(true);
            logger.info('Impulsivity theme initialized successfully');
          } else {
            setIsError(true);
            logger.warn('Impulsivity theme initialization incomplete');
            // Still allow the app to load, but in a potentially inconsistent state
            setIsInitialized(true);
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
          
          // Still mark as initialized to avoid blocking the app
          setIsInitialized(true);
        }
      };
      
      initTheme();
    }
    
    // Force initialization timeout after 3 seconds (reduced from 5 to make app more responsive)
    const timeout = setTimeout(() => {
      if (!isInitialized) {
        logger.warn('Impulsivity theme initialization timed out, continuing anyway');
        setIsInitialized(true);
        
        // Reapply immediate styles as fallback
        applyImmediateStyles();
      }
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [autoApply, applyTheme, isInitialized, logger, isSyncing, themeStoreLoading]);
  
  // If showing loader and still initializing, render a loading indicator
  if (showLoader && (isSyncing || themeStoreLoading) && !isInitialized) {
    return (
      <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-card p-6 rounded-lg shadow-lg border border-border flex flex-col items-center">
          <Loader className="animate-spin h-8 w-8 text-primary mb-4" />
          <p className="text-foreground font-medium">Initializing Impulsivity Theme...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}
