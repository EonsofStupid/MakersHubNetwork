
import { useEffect, useState } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { ThemeComponent } from '@/stores/theme/types';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { defaultImpulseTokens } from '../impulse/tokens';

export function useAdminTheme() {
  const { currentTheme, adminComponents, loadAdminComponents } = useThemeStore();
  const [isLoading, setIsLoading] = useState(true);
  const [componentStyles, setComponentStyles] = useState<Record<string, any>>({});
  const logger = useLogger('useAdminTheme', { category: LogCategory.THEME as string });

  // Convert component array to record indexed by component name
  useEffect(() => {
    const processComponents = async () => {
      try {
        setIsLoading(true);
        logger.debug('Processing admin theme components');
        
        // Load admin components if not already loaded
        if (!adminComponents || adminComponents.length === 0) {
          logger.debug('No admin components loaded, fetching from API');
          await loadAdminComponents();
        }
        
        // Map components to a more usable structure
        const componentMap: Record<string, any> = {};
        
        adminComponents.forEach((component: ThemeComponent) => {
          const componentName = component.component_name;
          componentMap[componentName] = component.styles;
        });
        
        setComponentStyles(componentMap);
        logger.debug('Admin theme components processed', { 
          details: { componentCount: Object.keys(componentMap).length } 
        });
      } catch (error) {
        logger.error('Error processing admin theme components', { 
          details: { error: error instanceof Error ? error.message : String(error) } 
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    processComponents();
  }, [adminComponents, loadAdminComponents, logger]);

  // Get impulse theme
  const impulseTheme = defaultImpulseTokens;
  
  // Generate utility classes from theme - temporarily use empty object
  const utilityClasses = {};

  return {
    currentTheme,
    componentStyles,
    isLoading,
    utilityClasses,
    impulseTheme
  };
}
