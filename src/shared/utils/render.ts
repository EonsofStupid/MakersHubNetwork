
/**
 * Utility functions for rendering and error handling
 */

/**
 * Convert an error object to a plain object for logging
 * @param error Any error object or unknown value
 * @returns A plain object representation of the error
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
    try {
      // Try to convert the object to a plain object
      return JSON.parse(JSON.stringify(error));
    } catch (e) {
      // If serialization fails, return a simple representation
      return { type: typeof error, toString: String(error) };
    }
  }
  
  return {
    type: typeof error,
    value: String(error)
  };
}

/**
 * Safely serialize an object to JSON, handling circular references
 * @param obj Object to serialize
 * @returns JSON string representation of the object
 */
export function safeStringify(obj: any): string {
  const seen = new WeakSet();
  
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular Reference]';
      }
      seen.add(value);
    }
    return value;
  }, 2);
}

/**
 * Convert React error boundaries caught errors to a readable format
 * @param error Error from React error boundary
 * @param info React component stack info
 * @returns Formatted error object
 */
export function formatErrorBoundaryError(error: Error, info: { componentStack: string }): Record<string, any> {
  return {
    error: errorToObject(error),
    componentStack: info.componentStack.split('\n').filter(Boolean)
  };
}

/**
 * Check if a value is a promise
 * @param value Value to check
 * @returns Whether the value is a promise
 */
export function isPromise(value: any): value is Promise<any> {
  return value && typeof value.then === 'function';
}

/**
 * Truncate a string to a maximum length with ellipsis
 * @param str String to truncate
 * @param maxLength Maximum length
 * @returns Truncated string
 */
export function truncate(str: string, maxLength: number = 100): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}
