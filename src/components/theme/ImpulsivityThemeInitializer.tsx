
import { useEffect, useState } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

interface ImpulsivityThemeInitializerProps {
  children: React.ReactNode;
  applyImmediately?: boolean;
}

export function ImpulsivityThemeInitializer({ 
  children, 
  applyImmediately = true 
}: ImpulsivityThemeInitializerProps) {
  const logger = useLogger('ImpulsivityThemeInitializer', LogCategory.UI);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize Impulsivity theme on component mount
  useEffect(() => {
    if (!isInitialized) {
      try {
        // Apply critical CSS variables immediately
        const root = document.documentElement;
        
        // Set cyberpunk theme colors as CSS variables
        root.style.setProperty('--site-primary', '186 100% 50%');
        root.style.setProperty('--site-secondary', '334 100% 59%');
        root.style.setProperty('--site-effect-color', '#00F0FF');
        root.style.setProperty('--site-effect-secondary', '#FF2D6E');
        root.style.setProperty('--site-effect-tertiary', '#8B5CF6');
        
        // Mark as initialized
        setIsInitialized(true);
        
        logger.info('Impulsivity theme initialized');
      } catch (error) {
        logger.error('Failed to initialize Impulsivity theme', { 
          details: { error: error instanceof Error ? error.message : String(error) }
        });
        
        // Still mark as initialized to prevent infinite retries
        setIsInitialized(true);
      }
    }
  }, [logger, isInitialized]);
  
  // Always render children - the useEffect above will apply the theme
  return <>{children}</>;
}
