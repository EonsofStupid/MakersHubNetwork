
import { useCallback } from 'react';
import { ThemeToken } from '@/shared/types/shared.types';

/**
 * Hook for converting theme tokens to various formats
 */
export const useTokenConverters = () => {
  // Convert theme tokens to CSS variables
  const tokensToCssVars = useCallback((tokens: ThemeToken[]): Record<string, string> => {
    const cssVars: Record<string, string> = {};
    
    tokens.forEach(token => {
      const name = token.name || token.token_name;
      const value = token.value || token.token_value;
      
      if (name && value) {
        cssVars[`--${name}`] = value;
      }
    });
    
    return cssVars;
  }, []);
  
  // Convert theme tokens to a simpler record
  const tokensToRecord = useCallback((tokens: ThemeToken[]): Record<string, string> => {
    const record: Record<string, string> = {};
    
    tokens.forEach(token => {
      const name = token.name || token.token_name;
      const value = token.value || token.token_value;
      
      if (name && value) {
        record[name] = value;
      }
    });
    
    return record;
  }, []);
  
  // Convert theme tokens to tailwind config format
  const tokensToTailwindConfig = useCallback((tokens: ThemeToken[]): any => {
    const config: Record<string, Record<string, string>> = {
      colors: {},
      spacing: {},
      fontFamily: {},
      fontSize: {},
      borderRadius: {},
      boxShadow: {},
      animation: {}
    };
    
    tokens.forEach(token => {
      const name = token.name || token.token_name;
      const value = token.value || token.token_value;
      const type = token.type || '';
      
      if (!name || !value) return;
      
      switch (type.toLowerCase()) {
        case 'color':
          config.colors[name] = value;
          break;
        case 'spacing':
          config.spacing[name] = value;
          break;
        case 'font-family':
          config.fontFamily[name] = value;
          break;
        case 'font-size':
          config.fontSize[name] = value;
          break;
        case 'border-radius':
          config.borderRadius[name] = value;
          break;
        case 'box-shadow':
          config.boxShadow[name] = value;
          break;
        case 'animation':
          config.animation[name] = value;
          break;
        default:
          // Handle other token types
          break;
      }
    });
    
    return config;
  }, []);
  
  return {
    tokensToCssVars,
    tokensToRecord,
    tokensToTailwindConfig
  };
};
