
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('TypeUtils', LogCategory.THEME);

/**
 * Safely access nested properties with fallback
 */
export function getNestedProperty<T>(
  obj: unknown,
  path: string[],
  fallback: T
): T {
  try {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
      return fallback;
    }
    
    let current: any = obj;
    
    for (const key of path) {
      if (current === null || current === undefined) {
        return fallback;
      }
      current = current[key];
    }
    
    return (current !== null && current !== undefined) ? current : fallback;
  } catch (error) {
    logger.warn('Error accessing nested property', { 
      details: safeDetails({ path: path.join('.'), error }) 
    });
    return fallback;
  }
}

/**
 * Type guard for string values
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard for number values
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Type guard for boolean values
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Type guard for array values
 */
export function isArray(value: unknown): value is Array<unknown> {
  return Array.isArray(value);
}

/**
 * Type guard for object values
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Safely parse JSON with fallback
 */
export function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    logger.warn('Failed to parse JSON', { details: safeDetails(error) });
    return fallback;
  }
}

/**
 * Safely stringify JSON with fallback
 */
export function safeJsonStringify(value: unknown, fallback: string = '{}'): string {
  try {
    return JSON.stringify(value);
  } catch (error) {
    logger.warn('Failed to stringify JSON', { details: safeDetails(error) });
    return fallback;
  }
}

/**
 * Extract defined values from an object, excluding undefined/null
 */
export function extractDefinedValues<T extends object>(obj: T): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
}
