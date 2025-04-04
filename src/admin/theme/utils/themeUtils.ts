
import { ImpulseTheme } from "@/admin/types/impulse.types";

/**
 * Gets a property from a theme object by following a dot-notation path
 * 
 * @param theme The theme object to get a property from
 * @param path Path to the property using dot notation (e.g., "colors.primary")
 * @param defaultValue Default value to return if property doesn't exist
 */
export function getThemeProperty<T>(
  theme: ImpulseTheme | null | undefined, 
  path: string, 
  defaultValue: T
): T {
  if (!theme) return defaultValue;
  
  const parts = path.split('.');
  let current: any = theme;
  
  for (const part of parts) {
    if (current === undefined || current === null) {
      return defaultValue;
    }
    
    current = current[part];
  }
  
  return current !== undefined && current !== null ? current : defaultValue;
}

/**
 * Ensures a value is a valid string, using default if not
 */
export function ensureStringValue(value: any, defaultValue: string): string {
  if (typeof value === 'string' && value.trim() !== '') {
    return value;
  }
  return defaultValue;
}

/**
 * Gets a color value from theme or returns fallback
 */
export function getThemeColorValue(
  theme: ImpulseTheme | null | undefined,
  path: string,
  fallback: string
): string {
  return ensureStringValue(getThemeProperty(theme, path, fallback), fallback);
}

/**
 * Check if a theme object is valid and has minimum required properties
 */
export function isValidTheme(theme: any): boolean {
  return !!(
    theme &&
    typeof theme === 'object' &&
    theme.colors &&
    theme.typography &&
    theme.effects &&
    theme.animation &&
    theme.components
  );
}

/**
 * Safely merge an update into a theme object
 */
export function mergeThemeUpdate(
  currentTheme: ImpulseTheme,
  update: Partial<ImpulseTheme>
): ImpulseTheme {
  return {
    ...currentTheme,
    ...update,
    colors: { ...currentTheme.colors, ...update.colors },
    typography: { ...currentTheme.typography, ...update.typography },
    effects: { ...currentTheme.effects, ...update.effects },
    animation: { ...currentTheme.animation, ...update.animation },
    components: { ...currentTheme.components, ...update.components }
  };
}
