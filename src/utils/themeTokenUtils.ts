import { DesignTokensStructure } from "@/types/theme";

/**
 * Removes undefined values from an object
 */
export function removeUndefineds<T extends Record<string, any>>(obj: T): T {
  const result = { ...obj };
  
  Object.keys(result).forEach(key => {
    if (result[key] === undefined) {
      delete result[key];
    }
  });
  
  return result;
}

/**
 * Updates theme colors in design tokens
 */
export function updateThemeColors(
  designTokens: DesignTokensStructure, 
  colors: Record<string, string>
): DesignTokensStructure {
  return {
    ...designTokens,
    colors: {
      ...designTokens.colors,
      ...removeUndefineds(colors)
    }
  };
}

/**
 * Updates theme effects in design tokens
 */
export function updateThemeEffects(
  designTokens: DesignTokensStructure,
  effects: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
  }
): DesignTokensStructure {
  return {
    ...designTokens,
    effects: {
      ...designTokens.effects,
      ...(effects.primary ? { primary: effects.primary } : {}),
      ...(effects.secondary ? { secondary: effects.secondary } : {}),
      ...(effects.tertiary ? { tertiary: effects.tertiary } : {})
    }
  };
}

/**
 * Create a theme sync utility placeholder
 */
export function syncThemeTokens(themeId: string, tokens: Record<string, any>): Promise<boolean> {
  // This would be implemented to sync with the database
  return Promise.resolve(true);
}
