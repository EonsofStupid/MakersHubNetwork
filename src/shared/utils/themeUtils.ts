// Update imports
import { DesignTokens, ThemeVariables, ThemeToken } from '@/shared/types/theme.types';

/**
 * Convert theme tokens to CSS variables
 */
export const tokensToCssVars = (tokens: DesignTokens | Record<string, ThemeToken[]>): Record<string, string> => {
  const variables: Record<string, string> = {};
  
  // Process design tokens object format
  if (!Array.isArray(tokens)) {
    Object.entries(tokens).forEach(([category, categoryTokens]) => {
      Object.entries(categoryTokens).forEach(([name, value]) => {
        if (typeof value === 'string') {
          variables[`--${category}-${name}`] = value;
        }
      });
    });
    return variables;
  }
  
  // Process array of token objects format
  (tokens as unknown as ThemeToken[]).forEach(token => {
    const value = token.token_value || token.value || '';
    const name = token.token_name || token.name;
    if (name && value) {
      variables[`--${token.category}-${name}`] = value;
    }
  });
  
  return variables;
};
