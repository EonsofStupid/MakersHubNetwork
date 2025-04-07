/**
 * Type guard utilities to safely handle unknown types
 */

import { z } from 'zod';

/**
 * Helper function to safely convert unknown values to boolean
 */
export function toBoolean(value: unknown): boolean {
  return value === true;
}

/**
 * Helper function that safely returns boolean or undefined for strict type checking
 */
export function toBooleanOrUndefined(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

/**
 * Helper function to safely convert string representation to boolean
 */
export function stringToBoolean(value: string | null | undefined): boolean {
  if (value === null || value === undefined) return false;
  return value.toLowerCase() === 'true';
}

/**
 * Function to safely handle ZodError instances
 */
export function zodErrorToBool(error: unknown): boolean {
  return error instanceof z.ZodError ? false : true;
}

/**
 * Type guard for checking if a value is a valid object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard for checking if a value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard for checking if a value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Type guard for checking if a value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Type guard for checking if a value is an array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Safe cast utility with type assertion
 */
export function safeCast<T>(value: unknown, defaultValue: T): T {
  return value as T ?? defaultValue;
}

/**
 * Type guard for valid hex color format
 */
export function isValidHexColor(value: unknown): value is string {
  return isString(value) && /^#([0-9A-F]{3}){1,2}$/i.test(value);
}

/**
 * Type guard for theme context values
 */
export function isValidThemeContext(value: unknown): value is 'site' | 'admin' | 'chat' | 'app' | 'training' {
  return isString(value) && ['site', 'admin', 'chat', 'app', 'training'].includes(value);
}
