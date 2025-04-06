
import { useMemo } from 'react';
import { useThemeStore } from '@/stores/theme/themeStore';
import { ComponentTokens, ThemeContext } from '@/types/theme';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

/**
 * Hook to retrieve component tokens for a specific component
 * @param componentName The name of the component to get tokens for
 * @param context The theme context (site, admin, chat)
 */
export function useComponentTokens(componentName: string, context: ThemeContext = 'site') {
  const { currentTheme } = useThemeStore();
  const logger = useLogger('ComponentTokens', LogCategory.UI);
  
  const styles = useMemo(() => {
    // Default fallback styles
    const fallbackStyles = {};
    
    try {
      if (!currentTheme?.component_tokens || !Array.isArray(currentTheme.component_tokens)) {
        return fallbackStyles;
      }
      
      // Find component tokens matching component name and context
      const componentToken = currentTheme.component_tokens.find(
        token => token.component_name === componentName && token.context === context
      );
      
      if (componentToken?.styles) {
        return componentToken.styles;
      }
      
      // Find component tokens matching just the component name (fallback)
      const fallbackToken = currentTheme.component_tokens.find(
        token => token.component_name === componentName
      );
      
      if (fallbackToken?.styles) {
        return fallbackToken.styles;
      }
      
      return fallbackStyles;
    } catch (error) {
      logger.error('Error retrieving component tokens', {
        details: {
          componentName,
          context,
          error: error instanceof Error ? error.message : String(error)
        }
      });
      
      return fallbackStyles;
    }
  }, [currentTheme, componentName, context, logger]);
  
  return styles;
}
