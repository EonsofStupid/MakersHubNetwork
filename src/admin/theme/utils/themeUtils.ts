
/**
 * Deep merges two objects, preferring the source values over target values
 */
export function deepMerge<T>(target: T, source: Partial<T>): T {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key as keyof typeof source])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key as keyof typeof source] });
        } else {
          (output as any)[key] = deepMerge(
            (target as any)[key], 
            source[key as keyof typeof source] as any
          );
        }
      } else {
        Object.assign(output, { [key]: source[key as keyof typeof source] });
      }
    });
  }
  
  return output;
}

/**
 * Checks if a value is an object
 */
export function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Converts theme tokens to CSS variables
 */
export function tokensToCssVars(theme: Record<string, any>, prefix = '--impulse-'): Record<string, string> {
  const result: Record<string, string> = {};
  
  function processObject(obj: Record<string, any>, path: string) {
    for (const key in obj) {
      const value = obj[key];
      const newPath = path ? `${path}-${key}` : key;
      
      if (typeof value === 'object') {
        processObject(value, newPath);
      } else {
        result[`${prefix}${newPath}`] = value;
      }
    }
  }
  
  processObject(theme, '');
  return result;
}

/**
 * Applies CSS variables to an element
 */
export function applyCssVars(element: HTMLElement, vars: Record<string, string>) {
  for (const [key, value] of Object.entries(vars)) {
    element.style.setProperty(key, value);
  }
}
