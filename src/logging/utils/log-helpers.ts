
import { LogCategory, LogOptions } from '../types';

/**
 * Helper to create log options with defaults
 */
export function createLogOptions(
  defaultCategory: LogCategory, 
  options?: Partial<Omit<LogOptions, 'category'>>
): LogOptions {
  return {
    category: defaultCategory,
    ...(options || {}),
  };
}

/**
 * Helper to add source to log options
 */
export function withSource(source: string, options?: Partial<LogOptions>): Partial<LogOptions> {
  return {
    ...options,
    source,
  };
}

/**
 * Helper to add details to log options
 */
export function withDetails(details: Record<string, unknown>, options?: Partial<LogOptions>): Partial<LogOptions> {
  return {
    ...options,
    details: {
      ...(options?.details || {}),
      ...details,
    },
  };
}

/**
 * Helper to create error log options
 */
export function createErrorLogOptions(
  defaultCategory: LogCategory,
  options?: Partial<Omit<LogOptions, 'category' | 'error'>>
): LogOptions {
  return {
    category: defaultCategory,
    error: true,
    ...(options || {}),
  };
}

/**
 * Helper to create success log options
 */
export function createSuccessLogOptions(
  defaultCategory: LogCategory,
  options?: Partial<Omit<LogOptions, 'category' | 'success'>>
): LogOptions {
  return {
    category: defaultCategory,
    success: true,
    ...(options || {}),
  };
}
