
/**
 * Creates a safe details object for logging from any error or value
 */
export function safeDetails(error: unknown): Record<string, any> {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      stack: error.stack,
    };
  } else if (error === null) {
    return { value: 'null' };
  } else if (error === undefined) {
    return { value: 'undefined' };
  } else if (typeof error === 'object') {
    try {
      // Try to safely convert the object to a loggable format
      return { ...error };
    } catch (err) {
      // If JSON.stringify fails, fallback to a string
      return { value: String(error) };
    }
  } else {
    // For primitives
    return { value: error };
  }
}
