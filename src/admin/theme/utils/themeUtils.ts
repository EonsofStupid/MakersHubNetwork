
/**
 * Deep merges two objects, preferring the source values over target values
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
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

/**
 * Gets a nested value from an object using a path
 */
export function getValueByPath(obj: Record<string, any>, path: string): any {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === undefined || current === null) return undefined;
    current = current[key];
  }
  
  return current;
}

/**
 * Sets a value at a nested path within an object
 */
export function setValueAtPath(obj: Record<string, any>, path: string, value: any): Record<string, any> {
  const result = { ...obj };
  const keys = path.split('.');
  let current = result;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || !isObject(current[key])) {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return result;
}
