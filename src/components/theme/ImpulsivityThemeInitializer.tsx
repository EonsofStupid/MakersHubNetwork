
import { useEffect, useState } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useThemeStore } from '@/stores/theme/themeStore';
import { Theme } from '@/types/theme';

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
  const { currentTheme } = useThemeStore();
  
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
        
        // Apply additional Impulsivity-specific variables if available from the theme
        if (currentTheme?.design_tokens?.effects) {
          const effects = currentTheme.design_tokens.effects;
          if (effects.primary) {
            root.style.setProperty('--site-effect-color', effects.primary);
          }
          if (effects.secondary) {
            root.style.setProperty('--site-effect-secondary', effects.secondary);
          }
          if (effects.tertiary) {
            root.style.setProperty('--site-effect-tertiary', effects.tertiary);
          }
        }
        
        // Mark as initialized
        setIsInitialized(true);
        
        logger.info('Impulsivity theme initialized', {
          details: {
            hasCustomEffects: !!currentTheme?.design_tokens?.effects,
            fromTheme: !!currentTheme
          }
        });
      } catch (error) {
        logger.error('Failed to initialize Impulsivity theme', { 
          details: { error: error instanceof Error ? error.message : String(error) }
        });
        
        // Still mark as initialized to prevent infinite retries
        setIsInitialized(true);
      }
    }
  }, [logger, isInitialized, currentTheme]);
  
  // Always render children - the useEffect above will apply the theme
  return <>{children}</>;
}
