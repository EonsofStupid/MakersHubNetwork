
/**
 * Utility to safely convert any value to a details object for logging
 * This ensures that any value can be correctly treated as a details object for TypeScript compatibility
 * 
 * @param value Any value to convert to a safe details object
 * @returns A safe object with consistent structure for logging
 */
export function safeDetails(value: unknown): Record<string, unknown> {
  if (value === undefined || value === null) {
    return {};
  }
  
  // If already a Record, return as is
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  
  // Convert Error objects with comprehensive details
  if (value instanceof Error) {
    return {
      message: value.message,
      name: value.name,
      stack: value.stack,
      // Include any custom properties on the error
      ...(Object.getOwnPropertyNames(value)
        .filter(prop => prop !== 'name' && prop !== 'message' && prop !== 'stack')
        .reduce((acc, prop) => {
          // @ts-ignore - We're dynamically accessing properties
          acc[prop] = (value as any)[prop];
          return acc;
        }, {} as Record<string, unknown>))
    };
  }
  
  // Convert arrays
  if (Array.isArray(value)) {
    return { data: value };
  }
  
  // Convert primitives
  return { value };
}
