
import { useEffect, useMemo } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { Theme } from '@/types/theme';

/**
 * Hook to access and apply theme variables
 */
export function useThemeVariables() {
  const currentTheme = useThemeStore(state => state.currentTheme);

  // Convert theme tokens to CSS variables
  const cssVariables = useMemo(() => {
    if (!currentTheme) return {};

    const variables: Record<string, string> = {};

    // Process design tokens
    Object.entries(currentTheme.design_tokens).forEach(([key, token]) => {
      variables[`--${key}`] = token.value;
    });

    // Process component tokens (if needed)
    Object.entries(currentTheme.component_tokens).forEach(([componentName, component]) => {
      Object.entries(component.tokens).forEach(([tokenName, value]) => {
        variables[`--${componentName}-${tokenName}`] = value;
      });
    });

    return variables;
  }, [currentTheme]);

  // Apply CSS variables to document root
  useEffect(() => {
    if (Object.keys(cssVariables).length === 0) return;

    // Apply variables to :root
    const root = document.documentElement;
    
    Object.entries(cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    return () => {
      // Cleanup
      Object.keys(cssVariables).forEach(property => {
        root.style.removeProperty(property);
      });
    };
  }, [cssVariables]);

  return {
    theme: currentTheme,
    cssVariables
  };
}
