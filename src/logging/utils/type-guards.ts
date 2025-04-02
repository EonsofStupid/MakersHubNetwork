
/**
 * Type guard to check if value is a record (object)
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && 
         typeof value === 'object' && 
         !Array.isArray(value) &&
         !(value instanceof Date);
}

/**
 * Type guard to check if value is an error
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error || 
         (typeof value === 'object' && 
          value !== null && 
          'message' in value && 
          'name' in value);
}

/**
 * Type guard to check if value can be rendered as a string
 */
export function isStringRenderable(value: unknown): value is string | number | boolean {
  return typeof value === 'string' || 
         typeof value === 'number' || 
         typeof value === 'boolean';
}
