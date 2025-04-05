
/**
 * Type guard utilities for common type checks
 */

/**
 * Check if a value is an Error object
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Check if a value is a Record object
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
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
 * Validates if a string is a valid UUID
 */
export function isValidUUID(value: string | undefined | null): value is string {
  if (!value) return false;
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(value);
}

/**
 * Generate a UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, 
          v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Convert any value to a proper log details object
 */
export function toLogDetails(details: unknown): Record<string, unknown> {
  if (details === null || details === undefined) {
    return {};
  }
  
  if (isRecord(details)) {
    return details;
  }
  
  if (isError(details)) {
    return {
      message: details.message,
      name: details.name,
      stack: details.stack
    };
  }
  
  if (Array.isArray(details)) {
    return { items: details };
  }
  
  return { value: details };
}
