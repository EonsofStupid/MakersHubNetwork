
import { useMemo } from 'react';
import { ThemeToken, ComponentTokens, DesignTokensStructure } from '@/types/theme';

/**
 * Hook that provides utilities for converting theme tokens between formats
 */
export function useTokenConverters() {
  
  // Convert design tokens object to array of ThemeToken objects
  const convertDesignTokensToArray = (tokens?: DesignTokensStructure): ThemeToken[] => {
    if (!tokens) return [];
    
    const result: ThemeToken[] = [];
    
    // Helper to recursively process nested objects
    const processObject = (obj: any, path: string[] = [], category: string = 'general') => {
      if (!obj || typeof obj !== 'object') return;
      
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = [...path, key];
        
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          // Recursively process nested objects
          processObject(value, currentPath, category);
        } else {
          // Add leaf node as token
          const tokenPath = currentPath.join('.');
          
          result.push({
            id: tokenPath,
            token_name: tokenPath,
            token_value: String(value),
            category: getTokenCategory(currentPath),
            description: '',
          });
        }
      });
    };
    
    // Determine token category from path
    const getTokenCategory = (path: string[]): string => {
      const firstSegment = path[0] || '';
      
      if (firstSegment === 'colors') return 'color';
      if (firstSegment === 'typography') return 'typography';
      if (firstSegment === 'effects') return 'effect';
      if (firstSegment === 'animation') return 'animation';
      if (firstSegment === 'components') return 'component';
      if (firstSegment === 'spacing') return 'spacing';
      
      return 'general';
    };
    
    // Process all top-level categories
    Object.entries(tokens).forEach(([category, values]) => {
      processObject(values, [category], category);
    });
    
    return result;
  };
  
  // Convert component tokens to array format
  const convertComponentTokensToArray = (components?: ComponentTokens[]): ComponentTokens[] => {
    if (!components || !Array.isArray(components)) return [];
    return components;
  };
  
  // Return the converter functions
  return useMemo(() => ({
    convertDesignTokensToArray,
    convertComponentTokensToArray
  }), []);
}
