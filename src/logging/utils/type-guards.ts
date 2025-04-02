
/**
 * Type guard to check if a value is a Record (object)
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard to check if a value is an Error
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Type guard to check if a value has a specific property
 */
export function hasProperty<K extends string>(
  value: unknown,
  property: K
): value is { [P in K]: unknown } {
  return isRecord(value) && property in value;
}

/**
 * Type guard to check if a value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard to check if a value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Type guard to check if a value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Safely convert any value to a Record suitable for logging details
 */
export function toLogDetails(value: unknown): Record<string, unknown> {
  // Handle errors specially to capture useful properties
  if (isError(value)) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
      ...extractErrorProperties(value)
    };
  }
  
  // If it's already a record, return it directly
  if (isRecord(value)) {
    return value;
  }
  
  // For primitives, wrap in a simple object
  if (isString(value) || isNumber(value) || isBoolean(value) || value === null || value === undefined) {
    return { value };
  }
  
  // For arrays, return the array wrapped in an object
  if (Array.isArray(value)) {
    return { array: value };
  }
  
  // Default case: try to convert to string or just return a placeholder
  try {
    return { value: String(value) };
  } catch {
    return { type: typeof value, stringified: false };
  }
}

/**
 * Extract additional properties from Error objects
 */
function extractErrorProperties(error: Error): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  // Extract any additional properties on the error
  for (const key in error) {
    if (key !== 'name' && key !== 'message' && key !== 'stack') {
      const value = (error as any)[key];
      result[key] = value;
    }
  }
  
  return result;
}
