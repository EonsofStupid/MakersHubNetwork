
import { useEffect, useState } from 'react';
import { useImpulsivityTheme } from '@/hooks/useImpulsivityTheme';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { Loader } from 'lucide-react';
import { useThemeStore } from '@/stores/theme/store';

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
  
  useEffect(() => {
    if (autoApply && !isInitialized && !isSyncing && !themeStoreLoading) {
      const initTheme = async () => {
        try {
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
          
          logger.error('Failed to initialize Impulsivity theme', { 
            details: { errorMessage } 
          });
          
          // Still mark as initialized to avoid blocking the app
          setIsInitialized(true);
        }
      };
      
      initTheme();
    }
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
