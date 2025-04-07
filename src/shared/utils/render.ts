
/**
 * Converts an Error object to a plain object for logging and serialization
 */
export function errorToObject(error: unknown): Record<string, any> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      // Use optional chaining to avoid Error.cause error
      cause: (error as any).cause ? errorToObject((error as any).cause) : undefined
    };
  }
  
  return {
    error: String(error)
  };
}
