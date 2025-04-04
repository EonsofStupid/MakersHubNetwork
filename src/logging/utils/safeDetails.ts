
import { isError, isRecord } from './type-guards';

/**
 * Utility to safely format details for logging
 * Handles errors, objects, and other types
 */
export function safeDetails(value: unknown): Record<string, any> {
  if (value === null || value === undefined) {
    return {};
  }
  
  if (isError(value)) {
    return {
      message: value.message,
      name: value.name,
      stack: value.stack,
      // Add additional properties if available
      ...(isRecord(value) ? Object.fromEntries(
        Object.entries(value)
          .filter(([key]) => !['message', 'name', 'stack'].includes(key))
      ) : {})
    };
  }
  
  if (typeof value === 'object' && !Array.isArray(value)) {
    try {
      // Try to convert to plain object
      return JSON.parse(JSON.stringify(value));
    } catch {
      // Fall back to string representation
      return { value: String(value) };
    }
  }
  
  return { value: String(value) };
}
