
import { DesignTokensStructure } from '@/types/theme';
import { defaultTokens } from '@/theme/tokenSchema';

/**
 * Updates colors within the design tokens structure
 */
export function updateThemeColors(
  tokens: DesignTokensStructure,
  newColors: Record<string, string>
): DesignTokensStructure {
  return {
    ...tokens,
    colors: {
      ...(tokens.colors || {}),
      ...newColors,
    },
  };
}

/**
 * Updates effects within the design tokens structure
 */
export function updateThemeEffects(
  tokens: DesignTokensStructure,
  newEffects: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
  }
): DesignTokensStructure {
  return {
    ...tokens,
    effects: {
      ...(tokens.effects || { shadows: {}, blurs: {}, gradients: {} }),
      ...newEffects,
    },
  };
}

/**
 * Updates all design tokens with new values
 */
export function updateDesignTokens(
  tokens: DesignTokensStructure,
  updates: Partial<DesignTokensStructure>
): DesignTokensStructure {
  return {
    ...tokens,
    ...updates,
    colors: {
      ...(tokens.colors || {}),
      ...(updates.colors || {}),
    },
    effects: {
      ...(tokens.effects || { shadows: {}, blurs: {}, gradients: {} }),
      ...(updates.effects || {}),
      shadows: {
        ...(tokens.effects?.shadows || {}),
        ...(updates.effects?.shadows || {}),
      },
      blurs: {
        ...(tokens.effects?.blurs || {}),
        ...(updates.effects?.blurs || {}),
      },
      gradients: {
        ...(tokens.effects?.gradients || {}),
        ...(updates.effects?.gradients || {}),
      },
    },
    typography: {
      ...(tokens.typography || {}),
      ...(updates.typography || {}),
      fontSizes: {
        ...(tokens.typography?.fontSizes || {}),
        ...(updates.typography?.fontSizes || {}),
      },
      fontFamilies: {
        ...(tokens.typography?.fontFamilies || {}),
        ...(updates.typography?.fontFamilies || {}),
      },
      lineHeights: {
        ...(tokens.typography?.lineHeights || {}),
        ...(updates.typography?.lineHeights || {}),
      },
      letterSpacing: {
        ...(tokens.typography?.letterSpacing || {}),
        ...(updates.typography?.letterSpacing || {}),
      },
    },
    animation: {
      ...(tokens.animation || {}),
      ...(updates.animation || {}),
      keyframes: {
        ...(tokens.animation?.keyframes || {}),
        ...(updates.animation?.keyframes || {}),
      },
      transitions: {
        ...(tokens.animation?.transitions || {}),
        ...(updates.animation?.transitions || {}),
      },
      durations: {
        ...(tokens.animation?.durations || {}),
        ...(updates.animation?.durations || {}),
      },
    },
  };
}

/**
 * Creates a complete design tokens structure with defaults for any missing values
 */
export function createCompleteDesignTokens(
  partial?: Partial<DesignTokensStructure>
): DesignTokensStructure {
  return {
    colors: {
      primary: defaultTokens.primary,
      secondary: defaultTokens.secondary,
      accent: defaultTokens.accent,
      background: defaultTokens.background,
      foreground: defaultTokens.foreground,
      card: defaultTokens.card,
      cardForeground: defaultTokens.cardForeground,
      muted: defaultTokens.muted,
      mutedForeground: defaultTokens.mutedForeground,
      border: defaultTokens.border,
      input: defaultTokens.input,
      ring: defaultTokens.ring,
      ...(partial?.colors || {})
    },
    effects: {
      shadows: {},
      blurs: {},
      gradients: {},
      primary: defaultTokens.effectPrimary,
      secondary: defaultTokens.effectSecondary,
      tertiary: defaultTokens.effectTertiary,
      ...(partial?.effects || {}),
    },
    spacing: partial?.spacing || {},
    typography: partial?.typography || {
      fontSizes: {},
      fontFamilies: {},
      lineHeights: {},
      letterSpacing: {},
    },
    animation: partial?.animation || {
      keyframes: {},
      transitions: {},
      durations: {
        fast: defaultTokens.transitionFast,
        normal: defaultTokens.transitionNormal,
        slow: defaultTokens.transitionSlow,
      },
    },
  };
}

/**
 * Removes any undefined values from an object (recursively)
 */
export function removeUndefineds<T extends Record<string, any>>(obj: T): T {
  const result: Record<string, any> = {};
  
  for (const key in obj) {
    if (obj[key] !== undefined) {
      if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        result[key] = removeUndefineds(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
  }
  
  return result as T;
}

/**
 * Safely retrieves a nested value from an object with a path
 * Example: getNestedValue(theme, 'design_tokens.colors.primary', '#000')
 */
export function getNestedValue<T>(obj: any, path: string, defaultValue: T): T {
  try {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current === undefined || current === null) {
        return defaultValue;
      }
      current = current[key];
    }
    
    return (current !== undefined && current !== null) ? current : defaultValue;
  } catch (e) {
    console.error(`Error getting nested value at path ${path}:`, e);
    return defaultValue;
  }
}
