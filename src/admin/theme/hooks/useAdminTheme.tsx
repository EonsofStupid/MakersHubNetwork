
import { useEffect, useState } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { ThemeComponent } from '@/stores/theme/types';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { defaultImpulseTokens } from '../impulse/tokens';
import { usePerformanceLogger } from '@/hooks/use-performance-logger';
import { safeDetails } from '@/logging/utils/safeDetails';

export function useAdminTheme() {
  const { currentTheme, adminComponents, loadAdminComponents } = useThemeStore();
  const [isLoading, setIsLoading] = useState(true);
  const [componentStyles, setComponentStyles] = useState<Record<string, any>>({});
  const logger = useLogger('useAdminTheme', { category: LogCategory.THEME as string });
  const { measure } = usePerformanceLogger('useAdminTheme', { category: LogCategory.THEME });

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
        
        if (Array.isArray(adminComponents)) {
          adminComponents.forEach((component: ThemeComponent) => {
            if (component && component.component_name && component.styles) {
              const componentName = component.component_name;
              componentMap[componentName] = component.styles;
              logger.debug(`Loaded component styles for: ${componentName}`);
            }
          });
          
          setComponentStyles(componentMap);
          logger.debug('Admin theme components processed', { 
            details: { 
              componentCount: Object.keys(componentMap).length,
              componentNames: Object.keys(componentMap)
            } 
          });
        } else {
          logger.warn('adminComponents is not an array', {
            details: { 
              adminComponentsType: typeof adminComponents,
              adminComponents
            }
          });
        }
      } catch (error) {
        logger.error('Error processing admin theme components', { 
          details: safeDetails(error)
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    measure('process-admin-components', processComponents);
  }, [adminComponents, loadAdminComponents, logger, measure]);

  // Get impulse theme
  const impulseTheme = defaultImpulseTokens;
  
  // Generate utility classes for theme components
  const utilityClasses = {
    // Text utilities
    text: {
      primary: 'text-[#00F0FF]',
      secondary: 'text-[#FF2D6E]',
      accent: 'text-[#8B5CF6]',
      foreground: 'text-[#F6F6F7]',
      muted: 'text-[rgba(255,255,255,0.7)]'
    },
    // Background utilities
    bg: {
      primary: 'bg-[#00F0FF]',
      secondary: 'bg-[#FF2D6E]',
      accent: 'bg-[#8B5CF6]',
      card: 'bg-[rgba(28,32,42,0.7)]',
      dark: 'bg-[#12121A]'
    },
    // Border utilities
    border: {
      primary: 'border-[#00F0FF]',
      secondary: 'border-[#FF2D6E]',
      accent: 'border-[#8B5CF6]',
      light: 'border-[rgba(255,255,255,0.2)]',
      dark: 'border-[rgba(0,0,0,0.2)]'
    },
    // Animation utilities
    animation: {
      glow: 'animate-pulse-glow',
      pulse: 'animate-pulse-slow',
      float: 'animate-float',
      scan: 'animate-scan-line'
    },
    // Effect utilities
    effect: {
      glow: 'shadow-[0_0_10px_rgba(0,240,255,0.5)]',
      neon: 'shadow-[0_0_5px_#00F0FF,0_0_10px_rgba(0,240,255,0.5)]',
      glass: 'backdrop-blur-xl bg-[rgba(28,32,42,0.7)] border-[rgba(255,255,255,0.1)]'
    }
  };

  return {
    currentTheme,
    componentStyles,
    isLoading,
    utilityClasses,
    impulseTheme
  };
}
