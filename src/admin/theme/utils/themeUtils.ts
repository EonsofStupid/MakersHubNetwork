
import { ImpulseTheme } from "../../types/impulse.types";
import { getLogger } from "@/logging";

const logger = getLogger('AdminThemeUtils');

/**
 * Deep merge utility function for theme objects
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  Object.keys(source).forEach(key => {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (
      sourceValue && 
      targetValue && 
      typeof sourceValue === 'object' && 
      typeof targetValue === 'object' && 
      !Array.isArray(sourceValue) && 
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue;
    }
  });

  return result;
}

/**
 * Flattens a nested theme object into key-value pairs
 * Used by the visual theme editor to list editable properties
 */
export function flattenTheme(
  theme: ImpulseTheme, 
  prefix = '',
  excludePaths: string[] = []
): Array<{ path: string; value: any; type: string }> {
  const result: Array<{ path: string; value: any; type: string }> = [];

  Object.entries(theme).forEach(([key, value]) => {
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    
    // Skip excluded paths
    if (excludePaths.some(path => newPrefix.startsWith(path))) {
      return;
    }
    
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      // Recurse into nested objects
      result.push(...flattenTheme(value as any, newPrefix, excludePaths));
    } else {
      // Determine the type for the editor
      let type = 'text';
      if (typeof value === 'number') {
        type = 'number';
      } else if (
        typeof value === 'string' && (
          /^#([0-9A-F]{3}){1,2}$/i.test(value) || 
          /^rgb/i.test(value) || 
          /^rgba/i.test(value) || 
          /^hsl/i.test(value)
        )
      ) {
        type = 'color';
      } else if (typeof value === 'boolean') {
        type = 'boolean';
      }
      
      result.push({ path: newPrefix, value, type });
    }
  });
  
  return result;
}

/**
 * Get a readable label from a theme property path
 */
export function getReadableLabel(path: string): string {
  const parts = path.split('.');
  const lastPart = parts[parts.length - 1];
  
  return lastPart
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}

/**
 * Get a value from a nested object using a path string
 */
export function getValueByPath(obj: any, path: string): any {
  return path.split('.').reduce((prev, curr) => {
    if (prev === undefined || prev === null) return undefined;
    return prev[curr];
  }, obj);
}

/**
 * Set a value in a nested object using a path string
 */
export function setValueByPath(obj: any, path: string, value: any): any {
  const copy = { ...obj };
  const keys = path.split('.');
  
  let current = copy;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] === undefined || current[key] === null) {
      current[key] = {};
    } else {
      current[key] = { ...current[key] };
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return copy;
}

/**
 * Convert theme object to CSS variables
 */
export function themeToCSS(theme: ImpulseTheme): string {
  const flattenedTheme = flattenTheme(theme);
  let css = ":root {\n";
  
  flattenedTheme.forEach(({ path, value }) => {
    const variableName = `--impulse-${path.replace(/\./g, '-')}`;
    css += `  ${variableName}: ${value};\n`;
  });
  
  css += "}\n";
  return css;
}

/**
 * Apply theme to document
 */
export function applyThemeToDocument(theme: ImpulseTheme): void {
  logger.debug("Applying Impulsivity theme to document");
  const flattenedTheme = flattenTheme(theme);
  const root = document.documentElement;
  
  flattenedTheme.forEach(({ path, value }) => {
    const variableName = `--impulse-${path.replace(/\./g, '-')}`;
    root.style.setProperty(variableName, String(value));
  });
}
