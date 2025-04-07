
import { DesignTokensStructure } from '@/types/theme';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

/**
 * Type guard to check if a value is a non-null object
 */
function isObject(val: unknown): val is Record<string, any> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
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
  const baseTokens: DesignTokensStructure = currentTokens || { colors: {}, effects: { shadows: {}, blurs: {}, gradients: {} } };
  
  try {
    // Create deep copy to avoid mutation
    const result = JSON.parse(JSON.stringify(baseTokens)) as DesignTokensStructure;
    
    // Update colors if provided
    if (updates.colors) {
      result.colors = {
        ...(result.colors || {}),
        ...updates.colors
      };
    }
    
    // Update effects if provided
    if (updates.effects) {
      result.effects = {
        shadows: { ...(result.effects?.shadows || {}), ...(updates.effects.shadows || {}) },
        blurs: { ...(result.effects?.blurs || {}), ...(updates.effects.blurs || {}) },
        gradients: { ...(result.effects?.gradients || {}), ...(updates.effects.gradients || {}) },
        ...(result.effects || {}),
        ...(updates.effects.primary !== undefined ? { primary: updates.effects.primary } : {}),
        ...(updates.effects.secondary !== undefined ? { secondary: updates.effects.secondary } : {}),
        ...(updates.effects.tertiary !== undefined ? { tertiary: updates.effects.tertiary } : {})
      };
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
  return updateDesignTokens(currentTokens, {
    colors: colorUpdates
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
  return updateDesignTokens(currentTokens, {
    effects: effectUpdates
  });
}
