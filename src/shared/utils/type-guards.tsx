
import React from 'react';
import { 
  isError, 
  isRecord, 
  isString, 
  isNumber, 
  isBoolean, 
  isValidUUID, 
  generateUUID,
  toLogDetails 
} from '@/logging/utils/type-guards';

/**
 * Type guard utilities for the application
 * Re-exports from logging/utils/type-guards for backwards compatibility
 */
export {
  isError,
  isRecord,
  isString,
  isNumber,
  isBoolean,
  isValidUUID,
  generateUUID,
  toLogDetails
};

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
