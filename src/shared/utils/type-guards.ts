
/**
 * Type guard utilities for the application
 */

/**
 * Check if a value is a plain object (Record)
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && 
         value !== null && 
         !Array.isArray(value) && 
         !(value instanceof Date) &&
         !(value instanceof Map) &&
         !(value instanceof Set) &&
         !(value instanceof RegExp);
}

/**
 * Check if a value is an array of a specific type
 */
export function isArrayOf<T>(
  value: unknown, 
  itemGuard: (item: unknown) => item is T
): value is T[] {
  return Array.isArray(value) && value.every(itemGuard);
}

/**
 * Check if a value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Check if a value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Check if a value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Check if a value is a function
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

/**
 * Check if a value is a promise
 */
export function isPromise<T = any>(value: unknown): value is Promise<T> {
  return value instanceof Promise || (
    isRecord(value) && 
    isFunction((value as any).then) && 
    isFunction((value as any).catch)
  );
}
