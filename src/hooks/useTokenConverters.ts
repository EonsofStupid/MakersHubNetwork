import { useMemo } from 'react';
import { DesignTokensStructure, ThemeToken, ComponentTokens } from '@/types/theme';

export function useTokenConverters() {
  /**
   * Converts design tokens object structure to array of tokens
   */
  const convertDesignTokensToArray = useMemo(() => (designTokens?: DesignTokensStructure): ThemeToken[] => {
    if (!designTokens) return [];
    
    const tokens: ThemeToken[] = [];
    
    // Process colors
    if (designTokens.colors) {
      Object.entries(designTokens.colors).forEach(([name, value]) => {
        tokens.push({
          id: `color-${name}`,
          token_name: name,
          token_value: value as string,
          category: 'colors'
        });
      });
    }
    
    // Process typography
    if (designTokens.typography) {
      // Font sizes
      if (designTokens.typography.fontSizes) {
        Object.entries(designTokens.typography.fontSizes).forEach(([name, value]) => {
          tokens.push({
            id: `font-size-${name}`,
            token_name: `fontSize.${name}`,
            token_value: value as string,
            category: 'typography.fontSizes'
          });
        });
      }
      
      // Font families
      if (designTokens.typography.fontFamilies) {
        Object.entries(designTokens.typography.fontFamilies).forEach(([name, value]) => {
          tokens.push({
            id: `font-family-${name}`,
            token_name: `fontFamily.${name}`,
            token_value: value as string,
            category: 'typography.fontFamilies'
          });
        });
      }
    }
    
    // Process effects
    if (designTokens.effects) {
      // Shadows
      if (designTokens.effects.shadows) {
        Object.entries(designTokens.effects.shadows).forEach(([name, value]) => {
          tokens.push({
            id: `shadow-${name}`,
            token_name: `shadow.${name}`,
            token_value: value as string,
            category: 'effects.shadows'
          });
        });
      }
    }
    
    return tokens;
  }, []);
  
  /**
   * Converts component tokens to array format
   */
  const convertComponentTokensToArray = useMemo(() => (componentTokens?: ComponentTokens[]): ComponentTokens[] => {
    if (!componentTokens) return [];
    
    // If componentTokens is already an array, return it
    if (Array.isArray(componentTokens)) {
      return componentTokens;
    }
    
    // Otherwise convert from object format
    const result: ComponentTokens[] = [];
    
    try {
      if (typeof componentTokens === 'object') {
        Object.entries(componentTokens).forEach(([name, styles]) => {
          result.push({
            id: `component-${name}`,
            component_name: name,
            styles: styles as Record<string, any>,
          });
        });
      }
    } catch (error) {
      console.error("Error converting component tokens:", error);
    }
    
    return result;
  }, []);
  
  return {
    convertDesignTokensToArray,
    convertComponentTokensToArray
  };
}
