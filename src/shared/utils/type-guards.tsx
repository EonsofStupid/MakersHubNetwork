
import React from 'react';

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

/**
 * Check if a value is an Error
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Safely convert any value to a details object for logging
 */
export function toLogDetails(value: unknown): Record<string, unknown> {
  if (isRecord(value)) {
    return Object.entries(value).reduce((acc, [key, val]) => {
      // Handle Error objects specially
      if (val instanceof Error) {
        acc[key] = {
          message: val.message,
          name: val.name,
          stack: val.stack,
          ...(val as any) // Include any custom properties on the error
        };
      } else if (typeof val === 'function') {
        // Skip functions
        acc[key] = '[Function]';
      } else if (typeof val === 'symbol') {
        // Convert symbols to strings
        acc[key] = val.toString();
      } else if (val === undefined) {
        // Skip undefined values
        acc[key] = '[undefined]';
      } else if (val === null) {
        // Include null values
        acc[key] = null;
      } else if (typeof val === 'object') {
        try {
          // Try to convert objects (including arrays) recursively
          acc[key] = toLogDetails(val);
        } catch (e) {
          // If that fails, use JSON stringify as a fallback
          try {
            acc[key] = JSON.parse(JSON.stringify(val));
          } catch (e2) {
            acc[key] = '[Unstringifiable Object]';
          }
        }
      } else {
        // Primitives can be used directly
        acc[key] = val;
      }
      return acc;
    }, {} as Record<string, unknown>);
  } else if (isError(value)) {
    return {
      message: value.message,
      name: value.name,
      stack: value.stack,
      ...(value as any) // Include any custom properties on the error
    };
  } else if (Array.isArray(value)) {
    return { array: value.map(item => (typeof item === 'object' && item !== null) ? toLogDetails(item) : item) };
  } else if (value === null) {
    return { value: null };
  } else if (value === undefined) {
    return { value: '[undefined]' };
  } else if (typeof value === 'function') {
    return { value: '[Function]' };
  } else if (typeof value === 'symbol') {
    return { value: value.toString() };
  } else if (typeof value === 'object') {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (e) {
      return { value: '[Unstringifiable Object]' };
    }
  } else {
    // For primitives, wrap in an object
    return { value };
  }
}
