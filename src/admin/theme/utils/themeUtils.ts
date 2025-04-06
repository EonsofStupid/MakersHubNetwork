
import { ImpulseTheme } from "../../types/impulse.types";

/**
 * Convert a theme object to CSS variables
 */
export function tokensToCssVars(
  tokens: Record<string, any>,
  prefix: string = "",
  path: string = ""
): Record<string, string> {
  const cssVars: Record<string, string> = {};

  for (const [key, value] of Object.entries(tokens)) {
    const varPath = path ? `${path}-${key}` : key;
    const varName = `--${prefix ? `${prefix}-` : ""}${varPath}`;

    if (typeof value === "object" && value !== null) {
      // Recursively process nested objects
      const nestedVars = tokensToCssVars(value, prefix, varPath);
      Object.assign(cssVars, nestedVars);
    } else {
      // Convert leaf values to CSS variable values
      cssVars[varName] = value.toString();
    }
  }

  return cssVars;
}

/**
 * Apply CSS variables to a DOM element
 */
export function applyCssVars(
  tokens: Record<string, any>,
  prefix: string = "",
  element: HTMLElement = document.documentElement
) {
  const cssVars = tokensToCssVars(tokens, prefix);
  
  for (const [name, value] of Object.entries(cssVars)) {
    element.style.setProperty(name, value);
  }
}

/**
 * Deep merge two objects
 */
export function deepMerge<T>(target: T, source: Partial<T>): T {
  if (typeof source !== 'object' || source === null) {
    return target;
  }

  const output = { ...target } as any;

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (
        typeof source[key] === 'object' && 
        source[key] !== null &&
        Object.prototype.hasOwnProperty.call(target, key) &&
        typeof (target as any)[key] === 'object' && 
        (target as any)[key] !== null
      ) {
        output[key] = deepMerge((target as any)[key], source[key] as any);
      } else {
        output[key] = source[key];
      }
    }
  }

  return output;
}
