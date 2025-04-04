
/**
 * Type guard utilities for logging module
 */

/**
 * Check if value is a Record object
 */
export function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Check if value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Check if value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Check if value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Check if value is an Error object
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Check if string is a valid UUID
 */
export function isValidUUID(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Generate a UUID
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}

/**
 * Convert any value to safe log details
 */
export function toLogDetails(value: any): Record<string, any> {
  if (value === undefined || value === null) return {};
  
  if (isError(value)) {
    return {
      message: value.message,
      name: value.name,
      stack: value.stack
    };
  }

  if (isRecord(value)) {
    return value;
  }

  return { value };
}

/**
 * Safe utility to check object properties
 */
export function hasProperty<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
