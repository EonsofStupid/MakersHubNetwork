
/**
 * Utility to safely convert any value to a details object for logging
 * This ensures that any value can be correctly treated as a details object for TypeScript compatibility
 */
export function safeDetails(value: unknown): Record<string, unknown> {
  if (value === undefined || value === null) {
    return {};
  }
  
  // If already a Record, return as is
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  
  // Convert Error objects
  if (value instanceof Error) {
    return {
      message: value.message,
      name: value.name,
      stack: value.stack,
      ...(value as any) // Include any custom properties on the error
    };
  }
  
  // Convert arrays
  if (Array.isArray(value)) {
    return { data: value };
  }
  
  // Convert primitives
  return { value };
}
