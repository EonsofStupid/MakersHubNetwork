
import { DesignTokensStructure } from '@/types/theme';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { defaultTokens } from '@/theme/tokenSchema';

/**
 * Type guard to check if a value is a non-null object
 */
function isObject(val: unknown): val is Record<string, any> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

/**
 * Creates a default design tokens structure with required properties
 */
function createDefaultTokens(): DesignTokensStructure {
  return {
    colors: {
      primary: defaultTokens.primary,
      secondary: defaultTokens.secondary,
    },
    effects: {
      shadows: {},
      blurs: {},
      gradients: {},
      primary: defaultTokens.effectPrimary,
      secondary: defaultTokens.effectSecondary,
      tertiary: defaultTokens.effectTertiary
    }
  };
}

/**
 * Safely extends/updates theme design tokens with new values
 * @param currentTokens Current design tokens structure
 * @param updates The updates to apply
 * @returns Updated design tokens structure
 */
export function updateDesignTokens(
  currentTokens: DesignTokensStructure | undefined, 
  updates: Partial<DesignTokensStructure>
): DesignTokensStructure {
  // Start with empty defaults if no tokens exist
  const baseTokens: DesignTokensStructure = currentTokens || createDefaultTokens();
  
  try {
    // Create deep copy to avoid mutation
    const result = JSON.parse(JSON.stringify(baseTokens)) as DesignTokensStructure;
    
    // Update colors if provided
    if (updates.colors) {
      result.colors = {
        ...result.colors,
        ...updates.colors
      };
    }
    
    // Update effects if provided
    if (updates.effects) {
      // Create a new effects object
      const updatedEffects = { ...result.effects };
      
      // Update shadows, blurs, and gradients if provided
      if (updates.effects.shadows) {
        updatedEffects.shadows = { ...updatedEffects.shadows, ...updates.effects.shadows };
      }
      
      if (updates.effects.blurs) {
        updatedEffects.blurs = { ...updatedEffects.blurs, ...updates.effects.blurs };
      }
      
      if (updates.effects.gradients) {
        updatedEffects.gradients = { ...updatedEffects.gradients, ...updates.effects.gradients };
      }
      
      // Update primary, secondary, tertiary 
      if (updates.effects.primary !== undefined) {
        updatedEffects.primary = updates.effects.primary;
      }
      
      if (updates.effects.secondary !== undefined) {
        updatedEffects.secondary = updates.effects.secondary;
      }
      
      if (updates.effects.tertiary !== undefined) {
        updatedEffects.tertiary = updates.effects.tertiary;
      }
      
      // Assign the updated effects
      result.effects = updatedEffects;
    }
    
    // Update other token categories
    if (updates.typography) {
      result.typography = {
        ...(result.typography || {}),
        ...updates.typography
      };
    }
    
    if (updates.animation) {
      result.animation = {
        ...(result.animation || {}),
        ...updates.animation
      };
    }
    
    if (updates.spacing) {
      result.spacing = {
        ...(result.spacing || {}),
        ...updates.spacing
      };
    }
    
    if (updates.admin) {
      result.admin = {
        ...(result.admin || {}),
        ...updates.admin
      };
    }
    
    return result;
  } catch (error) {
    const logger = getLogger();
    logger.error('Error updating design tokens', {
      category: LogCategory.THEME,
      details: {
        error: error instanceof Error ? error.message : String(error)
      }
    });
    
    // Return the original tokens as fallback
    return baseTokens;
  }
}

/**
 * Updates specific theme colors
 * @param currentTokens Current tokens or undefined
 * @param colorUpdates Color updates to apply
 * @returns Updated design tokens
 */
export function updateThemeColors(
  currentTokens: DesignTokensStructure | undefined,
  colorUpdates: Record<string, string>
): DesignTokensStructure {
  const baseTokens = currentTokens || createDefaultTokens();
  
  return updateDesignTokens(baseTokens, {
    colors: {
      ...baseTokens.colors,
      ...colorUpdates
    }
  });
}

/**
 * Updates specific theme effects
 * @param currentTokens Current tokens or undefined
 * @param effectUpdates Effect updates to apply
 * @returns Updated design tokens
 */
export function updateThemeEffects(
  currentTokens: DesignTokensStructure | undefined,
  effectUpdates: { primary?: string; secondary?: string; tertiary?: string; shadows?: Record<string, any>; blurs?: Record<string, any>; gradients?: Record<string, any> }
): DesignTokensStructure {
  const baseTokens = currentTokens || createDefaultTokens();
  
  return updateDesignTokens(baseTokens, {
    effects: {
      ...baseTokens.effects,
      ...effectUpdates
    }
  });
}

/**
 * Utility to remove undefined values from an object
 */
export function removeUndefineds<T extends Record<string, any>>(obj: T): T {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as T);
}
