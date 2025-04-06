
/**
 * Helper functions for type conversions and safety
 */

/**
 * Safely converts an unknown value to a Record<string, unknown>
 * Useful for handling unknown error objects or API responses
 */
export function toRecord(value: unknown): Record<string, unknown> | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  
  if (typeof value === 'object' && value !== null) {
    return value as Record<string, unknown>;
  }
  
  if (typeof value === 'string') {
    return { value };
  }
  
  return { value };
}

/**
 * Safely cast any value to a specific type with runtime validation
 * This is just a type assertion helper, no actual validation happens
 */
export function safeCast<T>(value: unknown): T {
  return value as T;
}

/**
 * Deep merge of objects, useful for theme merging
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

function isObject(item: unknown): item is Record<string, any> {
  return Boolean(item && typeof item === 'object' && !Array.isArray(item));
}
