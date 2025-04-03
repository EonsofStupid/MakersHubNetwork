
import { v4 as uuid } from 'uuid';

/**
 * Check if a value is an Error object
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Check if a value is a record (object)
 */
export function isRecord(value: unknown): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
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
 * Check if a string is a valid UUID
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Generate a UUID
 */
export function generateUUID(): string {
  return uuid();
}

/**
 * Format data for the details field in logs
 */
export function toLogDetails(data: unknown): Record<string, unknown> {
  if (data === null || data === undefined) {
    return {};
  }
  
  if (isError(data)) {
    return {
      message: data.message,
      stack: data.stack,
      name: data.name
    };
  }
  
  if (isRecord(data)) {
    // Convert any Error objects in the record
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (isError(value)) {
        result[key] = {
          message: value.message,
          stack: value.stack,
          name: value.name
        };
      } else {
        result[key] = value;
      }
    }
    return result;
  }
  
  // For primitive values, just wrap in an object
  return { value: data };
}
