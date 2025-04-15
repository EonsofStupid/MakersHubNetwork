
import { useMemo } from 'react';
import { useThemeStore } from '@/shared/stores/theme/store';

/**
 * Hook for accessing theme variables
 * @returns {Object} Theme variables and component-specific tokens
 */
export function useThemeVariables() {
  const variables = useThemeStore(state => state.variables);
  const componentTokens = useThemeStore(state => state.componentTokens);
  const theme = useThemeStore(state => state.theme);
  const tokens = useThemeStore(state => state.tokens);

  const cssVariables = useMemo(() => {
    // Create a dictionary of CSS variables from theme tokens
    const cssVars: Record<string, string> = {};
    if (tokens && Array.isArray(tokens)) {
      tokens.forEach((token: any) => {
        if (token && typeof token.token_name === 'string') {
          cssVars[token.token_name] = token.token_value as string;
        }
      });
    }
    
    // Add component-specific styles
    if (componentTokens && Array.isArray(componentTokens)) {
      componentTokens.forEach((component: any) => {
        if (component && typeof component.component_name === 'string') {
          // Component-specific variables would be prefixed with component name
          Object.entries(component.styles || {}).forEach(([key, value]) => {
            cssVars[`${component.component_name}-${key}`] = value as string;
          });
        }
      });
    }
    
    return cssVars;
  }, [tokens, componentTokens]);

  return { theme, variables, cssVariables };
}

export default useThemeVariables;
