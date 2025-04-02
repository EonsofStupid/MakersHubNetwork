
/**
 * Type guard to check if a value is a record (object)
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Type guard to check if a value is a valid log level
 */
export function isValidLogLevel(level: number): boolean {
  return Number.isInteger(level) && level >= 0 && level <= 6;
}

/**
 * Type guard to check if a value is an Error object
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Type guard to check if a value is a Promise
 */
export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return value instanceof Promise || 
    (value !== null && 
     typeof value === 'object' && 
     'then' in value && 
     typeof value.then === 'function');
}
