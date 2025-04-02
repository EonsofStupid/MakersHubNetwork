
import { ImpulseTheme } from "../../types/impulse.types";
import { getLogger } from "@/logging";

const logger = getLogger('AdminThemeUtils');

/**
 * Applies a theme directly to the document root as CSS variables
 * Used for immediate styling before React hydration
 */
export function applyThemeToDocument(theme: ImpulseTheme): void {
  try {
    const root = document.documentElement;
    
    // Apply primary colors
    root.style.setProperty('--impulse-primary', theme.colors.primary);
    root.style.setProperty('--impulse-secondary', theme.colors.secondary);
    
    // Apply background colors
    root.style.setProperty('--impulse-bg-main', theme.colors.background.main);
    root.style.setProperty('--impulse-bg-card', theme.colors.background.card);
    root.style.setProperty('--impulse-bg-overlay', theme.colors.background.overlay);
    
    // Apply text colors
    root.style.setProperty('--impulse-text-primary', theme.colors.text.primary);
    root.style.setProperty('--impulse-text-secondary', theme.colors.text.secondary);
    root.style.setProperty('--impulse-text-accent', theme.colors.text.accent);
    
    // Apply border colors
    root.style.setProperty('--impulse-border-normal', theme.colors.borders.normal);
    root.style.setProperty('--impulse-border-hover', theme.colors.borders.hover);
    root.style.setProperty('--impulse-border-active', theme.colors.borders.active);
    
    // Apply effect values
    root.style.setProperty('--impulse-glow-primary', theme.effects.glow.primary);
    root.style.setProperty('--impulse-glow-secondary', theme.effects.glow.secondary);
    root.style.setProperty('--impulse-glow-hover', theme.effects.glow.hover);
    
    // Animation timings
    root.style.setProperty('--impulse-duration-fast', theme.animation.duration.fast);
    root.style.setProperty('--impulse-duration-normal', theme.animation.duration.normal);
    root.style.setProperty('--impulse-duration-slow', theme.animation.duration.slow);
    
    // Set body background and text color for immediate visibility
    document.body.style.backgroundColor = theme.colors.background.main;
    document.body.style.color = theme.colors.text.primary;
    
    logger.debug('Applied theme tokens to document root');
  } catch (error) {
    logger.error('Failed to apply theme tokens to document', { error });
  }
}

/**
 * Flattens theme object into an array of path/value pairs
 * Used by the theme editor UI
 */
export function flattenTheme(theme: ImpulseTheme) {
  const result: Array<{path: string, value: any, type: string}> = [];
  
  function traverse(obj: any, currentPath: string = '') {
    for (const key in obj) {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        traverse(obj[key], newPath);
      } else {
        // Determine the type of value
        let type = 'text';
        if (typeof obj[key] === 'number') {
          type = 'number';
        } else if (typeof obj[key] === 'string') {
          // Check if it's a color
          if (obj[key].match(/^#([0-9A-F]{3}){1,2}$/i) || 
              obj[key].match(/rgba?\(/) ||
              obj[key].match(/hsla?\(/)) {
            type = 'color';
          }
        }
        
        result.push({
          path: newPath,
          value: obj[key],
          type
        });
      }
    }
  }
  
  traverse(theme);
  return result;
}

/**
 * Gets a readable label from a property path
 */
export function getReadableLabel(path: string): string {
  const parts = path.split('.');
  const label = parts[parts.length - 1]
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase();
  
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/**
 * Helper to get a nested property from an object using a path string
 */
export function getNestedProperty(obj: any, path: string): any {
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === undefined || current === null) {
      return undefined;
    }
    current = current[part];
  }
  
  return current;
}

/**
 * Helper to set a nested property in an object using a path string
 */
export function setNestedProperty(obj: any, path: string, value: any): any {
  const parts = path.split('.');
  const lastPart = parts.pop()!;
  
  let current = obj;
  
  // Create path if it doesn't exist
  for (const part of parts) {
    if (current[part] === undefined) {
      current[part] = {};
    }
    current = current[part];
  }
  
  // Set the value
  current[lastPart] = value;
  
  return obj;
}
