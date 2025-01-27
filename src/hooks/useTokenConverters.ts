import { ThemeToken, ComponentTokens } from "@/types/theme";

export function useTokenConverters() {
  const convertDesignTokensToArray = (tokens: Record<string, any>): ThemeToken[] => {
    if (!tokens || typeof tokens !== 'object') return [];
    
    const result: ThemeToken[] = [];
    const processTokens = (obj: any, category: string = '') => {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          processTokens(value, key);
        } else {
          result.push({
            id: `${category}-${key}`,
            token_name: key,
            token_value: String(value),
            category: category || 'default',
          });
        }
      });
    };
    
    processTokens(tokens);
    return result;
  };

  const convertComponentTokensToArray = (tokens: Record<string, any>): ComponentTokens[] => {
    if (!tokens || typeof tokens !== 'object') return [];
    
    return Object.entries(tokens).map(([name, tokenData]) => ({
      id: name,
      component_name: name,
      tokens: tokenData || {},
      styles: tokenData || {},
      description: '',
    }));
  };

  return {
    convertDesignTokensToArray,
    convertComponentTokensToArray,
  };
}