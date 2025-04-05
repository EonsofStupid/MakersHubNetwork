
import { useEffect, useState } from 'react';
import { useImpulsivityTheme } from '@/hooks/useImpulsivityTheme';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

interface ImpulsivityInitProps {
  autoApply?: boolean;
  children?: React.ReactNode;
}

export function ImpulsivityInit({ autoApply = true, children }: ImpulsivityInitProps) {
  const { applyTheme } = useImpulsivityTheme();
  const [isInitialized, setIsInitialized] = useState(false);
  const logger = useLogger('ImpulsivityInit', LogCategory.UI);
  
  useEffect(() => {
    if (autoApply && !isInitialized) {
      const initTheme = async () => {
        try {
          logger.info('Initializing Impulsivity theme');
          await applyTheme();
          setIsInitialized(true);
          logger.info('Impulsivity theme initialized successfully');
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'Unknown error initializing theme';
          
          logger.error('Failed to initialize Impulsivity theme', { 
            details: { errorMessage } 
          });
        }
      };
      
      initTheme();
    }
  }, [autoApply, applyTheme, isInitialized, logger]);
  
  return <>{children}</>;
}

// Use this component in your application root to automatically apply the theme
// Example: <ImpulsivityInit autoApply={true}><App /></ImpulsivityInit>
