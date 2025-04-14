
import { DesignTokens, ThemeVariables } from '@/types/theme';

/**
 * Converts theme tokens to CSS variables
 * @param tokens Theme design tokens
 * @returns Record of CSS variables
 */
export const tokensToCssVars = (tokens: DesignTokens): Record<string, string> => {
  const cssVars: Record<string, string> = {};

  if (!tokens) return cssVars;

  // Process colors
  if (tokens.colors) {
    Object.entries(tokens.colors).forEach(([key, value]) => {
      cssVars[`--color-${key}`] = value as string;
    });
  }

  // Process spacing
  if (tokens.spacing) {
    Object.entries(tokens.spacing).forEach(([key, value]) => {
      cssVars[`--spacing-${key}`] = value as string;
    });
  }

  // Process typography
  if (tokens.typography) {
    Object.entries(tokens.typography).forEach(([key, value]) => {
      if (typeof value === 'string') {
        cssVars[`--typography-${key}`] = value;
      }
    });
  }

  return cssVars;
};

/**
 * Applies theme variables to the document root
 * @param variables Theme variables
 */
export const applyThemeVariables = (variables: ThemeVariables | undefined) => {
  if (!variables) return;

  const root = document.documentElement;
  
  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
};

/**
 * Generates CSS styles from theme tokens
 * @param tokens Theme design tokens
 * @returns CSS style object
 */
export const generateThemeStyles = (tokens: DesignTokens): Record<string, string> => {
  const styles: Record<string, string> = {};
  
  if (!tokens) return styles;
  
  // Generate style properties from tokens
  if (tokens.colors) {
    styles['--background'] = tokens.colors.background as string || '#ffffff';
    styles['--foreground'] = tokens.colors.foreground as string || '#000000';
    styles['--primary'] = tokens.colors.primary as string || '#0070f3';
  }
  
  return styles;
};
