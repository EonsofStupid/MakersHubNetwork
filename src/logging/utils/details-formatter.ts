
/**
 * Utility to safely format details for logging
 * This ensures that any value can be correctly treated as a details object
 */

import { isRecord, isError } from './type-guards';

/**
 * Safely convert any value to a details object for logging
 * This addresses the type conversion errors throughout the application
 */
export function formatLogDetails(details: unknown): Record<string, unknown> | undefined {
  if (details === undefined) {
    return undefined;
  }
  
  // If already a Record, return as is
  if (isRecord(details)) {
    return details;
  }
  
  // Convert Error objects
  if (isError(details)) {
    return {
      message: details.message,
      name: details.name,
      stack: details.stack,
      ...(details as any) // Include any custom properties on the error
    };
  }
  
  // Convert arrays
  if (Array.isArray(details)) {
    return { data: details };
  }
  
  // Convert primitives
  return { value: details };
}
