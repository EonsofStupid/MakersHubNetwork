
import { useState, useMemo } from 'react';
import { ThemeToken, Theme, ComponentTokens } from '@/types/theme';
import { useLogger } from './use-logger';
import { LogCategory } from '@/logging/types';

/**
 * Hook for converting between theme data structures
 */
export function useTokenConverters() {
  const logger = useLogger('useTokenConverters', { category: LogCategory.THEME });
  
  /**
   * Convert nested design tokens to a flat array format
   */
  const convertDesignTokensToArray = useMemo(() => {
    return (designTokens?: Record<string, any>): ThemeToken[] => {
      if (!designTokens) {
        return [];
      }
      
      try {
        const tokens: ThemeToken[] = [];
        
        const flattenTokens = (
          obj: Record<string, any>, 
          parentKey: string = '',
          category: string = ''
        ) => {
          if (typeof obj !== 'object' || obj === null) return;
          
          Object.entries(obj).forEach(([key, value]) => {
            const currentKey = parentKey ? `${parentKey}.${key}` : key;
            const currentCategory = category || key;
            
            if (typeof value === 'object' && value !== null) {
              flattenTokens(value, currentKey, currentCategory);
            } else {
              tokens.push({
                id: `token-${currentKey.replace(/\./g, '-')}`,
                token_name: currentKey,
                token_value: String(value),
                category: currentCategory,
                description: '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
            }
          });
        };
        
        flattenTokens(designTokens);
        return tokens;
      } catch (error) {
        logger.error('Error converting design tokens to array', {
          details: { error }
        });
        return [];
      }
    };
  }, [logger]);
  
  /**
   * Convert component tokens to an array format
   */
  const convertComponentTokensToArray = useMemo(() => {
    return (componentTokens?: ComponentTokens[]): ThemeToken[] => {
      if (!componentTokens || !Array.isArray(componentTokens)) {
        return [];
      }
      
      try {
        const tokens: ThemeToken[] = [];
        
        componentTokens.forEach(component => {
          if (typeof component.styles === 'object' && component.styles !== null) {
            Object.entries(component.styles).forEach(([key, value]) => {
              tokens.push({
                id: `comp-token-${component.id}-${key}`,
                token_name: `${component.component_name}.${key}`,
                token_value: String(value),
                category: 'components',
                description: `Style for ${component.component_name}`,
                created_at: component.created_at || new Date().toISOString(),
                updated_at: component.updated_at || new Date().toISOString()
              });
            });
          }
        });
        
        return tokens;
      } catch (error) {
        logger.error('Error converting component tokens to array', {
          details: { error }
        });
        return [];
      }
    };
  }, [logger]);
  
  return {
    convertDesignTokensToArray,
    convertComponentTokensToArray
  };
}
