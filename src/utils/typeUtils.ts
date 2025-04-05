
/**
 * Type safety utilities for safely working with unknown data
 */

/**
 * Safely cast an unknown value to a specific type with runtime validation
 * 
 * @param value The unknown value to cast
 * @param validator A function that validates if the value is of the expected type
 * @param fallback A fallback value to use if validation fails
 * @returns The validated value or fallback
 */
export function safeCast<T>(
  value: unknown, 
  validator: (val: unknown) => boolean,
  fallback: T
): T {
  if (validator(value)) {
    return value as T;
  }
  return fallback;
}

/**
 * Check if a value is a valid object (not null, not array)
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Check if a value is a valid array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Check if a value is a valid string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Check if a value is a valid number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Check if a value is a valid boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Safely access a nested property from an object with a fallback value
 */
export function safelyGetNestedValue<T>(
  obj: unknown, 
  path: string[], 
  fallback: T
): T {
  if (!isObject(obj)) return fallback;
  
  let current: unknown = obj;
  
  for (const key of path) {
    if (!isObject(current)) {
      return fallback;
    }
    current = current[key];
  }
  
  return current as T ?? fallback;
}

/**
 * Check if value is a valid hex color
 */
export function isValidHexColor(value: unknown): value is string {
  return isString(value) && /^#([0-9A-F]{3}){1,2}$/i.test(value);
}
