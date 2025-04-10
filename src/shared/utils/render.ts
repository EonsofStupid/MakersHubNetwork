
/**
 * Converts an error object to a plain object for safe serialization
 */
export function errorToObject(error: unknown): Record<string, any> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause ? errorToObject(error.cause) : undefined,
    };
  }
  
  if (typeof error === 'object' && error !== null) {
    return { ...error };
  }
  
  return { message: String(error) };
}
