
import { DesignTokens, ThemeToken } from '@/shared/types/theme.types';

export const tokensToCssVars = (tokens: DesignTokens): Record<string, string> => {
  const variables: Record<string, string> = {};
  
  Object.entries(tokens).forEach(([category, categoryTokens]) => {
    if (categoryTokens && typeof categoryTokens === 'object') {
      Object.entries(categoryTokens).forEach(([name, value]) => {
        if (typeof value === 'string') {
          variables[`--${category}-${name}`] = value;
        }
      });
    }
  });
  
  return variables;
};
