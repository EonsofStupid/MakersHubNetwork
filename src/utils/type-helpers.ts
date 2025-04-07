
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
 * Fixed to properly handle generic types
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target } as T;
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      const sourceKey = key as keyof typeof source;
      const targetKey = key as keyof typeof target;
      
      if (isObject(source[sourceKey])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[sourceKey] });
        } else if (isObject(target[targetKey])) {
          output[targetKey] = deepMerge(
            target[targetKey] as Record<string, any>,
            source[sourceKey] as Record<string, any>
          ) as any;
        }
      } else {
        Object.assign(output, { [key]: source[sourceKey] });
      }
    });
  }
  
  return output;
}

function isObject(item: unknown): item is Record<string, any> {
  return Boolean(item && typeof item === 'object' && !Array.isArray(item));
}
