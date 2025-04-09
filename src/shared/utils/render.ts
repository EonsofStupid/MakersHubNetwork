
/**
 * Convert an error object to a plain serializable object
 * This is useful for logging errors
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
  
  if (typeof error === 'string') {
    return { message: error };
  }
  
  if (error && typeof error === 'object') {
    return { ...error };
  }
  
  return { message: String(error) };
}

/**
 * Get a readable error message from any error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return String(error);
}
