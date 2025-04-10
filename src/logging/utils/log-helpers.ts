/**
 * Log helper utilities for enhancing log messages
 */

/**
 * Formats an object for logging with details
 * @param details Object containing details to log
 * @returns Formatted log object
 */
export const withDetails = (details: any): Record<string, any> => {
  if (details && typeof details === 'object') {
    return details;
  } else {
    return { message: String(details) };
  }
};

/**
 * Formats an error object for logging
 * @param error Error object
 * @returns Formatted error object for logging
 */
export function withError(error: Error | unknown): { error: Record<string, any> } {
  if (error instanceof Error) {
    return {
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack,
      }
    };
  }
  
  return { error: String(error) };
}

/**
 * Creates a timed log entry with duration information
 * @param startTime Start time in milliseconds
 * @param operation Name of the operation being timed
 * @returns Formatted log object with duration
 */
export function withTiming(startTime: number, operation: string): { timing: { operation: string, durationMs: number } } {
  const durationMs = Date.now() - startTime;
  return {
    timing: {
      operation,
      durationMs
    }
  };
}

/**
 * Creates a log entry with user context
 * @param userId User ID
 * @param additionalInfo Additional user context
 * @returns Formatted log object with user context
 */
export function withUserContext(userId: string, additionalInfo?: Record<string, any>): { user: Record<string, any> } {
  return {
    user: {
      id: userId,
      ...additionalInfo
    }
  };
}

/**
 * Enhances a log message with request context
 * @param req Request object
 * @returns Formatted log object with request context
 */
export function withRequestContext(req: any): { request: Record<string, any> } {
  return {
    request: {
      path: req?.url || req?.path,
      method: req?.method,
      headers: req?.headers,
      ip: req?.ip
    }
  };
}
