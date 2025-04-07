
import { LogCategory, LogOptions } from '../types';

/**
 * Helper function that creates a LogOptions object with type-safety
 * This helps solve the issue with Omit<LogOptions, "category"> type
 */
export function createLogOptions(
  category: LogCategory,
  options: Partial<Omit<LogOptions, 'category'>> = {}
): LogOptions {
  return {
    category,
    ...options,
  };
}

/**
 * Helper function to safely add source to log options
 */
export function withSource(
  source: string,
  options: LogOptions = {}
): LogOptions {
  return {
    ...options,
    source,
  };
}

/**
 * Helper function to safely add details to log options
 */
export function withDetails(
  details: Record<string, unknown>,
  options: LogOptions = {}
): LogOptions {
  return {
    ...options,
    details: {
      ...(options.details || {}),
      ...details,
    },
  };
}

/**
 * Helper function to create error log options
 */
export function createErrorLogOptions(
  category: LogCategory,
  error: unknown,
  additionalDetails: Record<string, unknown> = {}
): LogOptions {
  const errorDetails = error instanceof Error
    ? {
        message: error.message,
        name: error.name,
        stack: error.stack,
      }
    : { error: String(error) };

  return {
    category,
    error: true,
    details: {
      ...errorDetails,
      ...additionalDetails,
    },
  };
}

/**
 * Helper function to create success log options
 */
export function createSuccessLogOptions(
  category: LogCategory,
  details: Record<string, unknown> = {}
): LogOptions {
  return {
    category,
    success: true,
    details,
  };
}
