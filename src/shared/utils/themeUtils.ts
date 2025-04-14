
/**
 * Theme utility functions
 */

/**
 * Convert theme tokens to CSS variables
 */
export const tokensToCssVars = (tokens: Record<string, any>): Record<string, string> => {
  const cssVars: Record<string, string> = {};
  
  if (!tokens) return cssVars;
  
  Object.entries(tokens).forEach(([key, value]) => {
    if (typeof value === 'string' || typeof value === 'number') {
      cssVars[`--${key}`] = String(value);
    }
  });
  
  return cssVars;
};

/**
 * Apply theme tokens to document root
 */
export const applyThemeTokens = (tokens: Record<string, any>): void => {
  const cssVars = tokensToCssVars(tokens);
  const root = document.documentElement;
  
  Object.entries(cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};
