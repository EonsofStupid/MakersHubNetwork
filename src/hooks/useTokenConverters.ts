
import { useCallback } from 'react';
import { ThemeToken, ComponentTokens } from '@/types/theme';

/**
 * Hook to convert theme tokens to arrays for easier rendering
 */
export function useTokenConverters() {
  /**
   * Convert design tokens object to array format for display
   */
  const convertDesignTokensToArray = useCallback((tokens?: Record<string, ThemeToken>) => {
    if (!tokens) return [];
    
    return Object.entries(tokens).map(([key, token]) => ({
      name: key,
      value: token.value,
      type: token.type,
      description: token.description || ''
    }));
  }, []);
  
  /**
   * Convert component tokens to array format for display
   */
  const convertComponentTokensToArray = useCallback((components?: Record<string, ComponentTokens>) => {
    if (!components) return [];
    
    return Object.entries(components).map(([key, component]) => ({
      id: key,
      name: component.name,
      description: component.description || '',
      tokens: Object.entries(component.tokens).map(([tokenKey, value]) => ({
        name: tokenKey,
        value
      }))
    }));
  }, []);
  
  return {
    convertDesignTokensToArray,
    convertComponentTokensToArray
  };
}
