
/**
 * Type guards for safely working with unknown types
 */

/**
 * Checks if a value is a non-null object that's not an array
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Checks if a value is a primitive (string, number, boolean) or null/undefined
 */
export function isPrimitive(value: unknown): value is string | number | boolean | null | undefined {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}

/**
 * Checks if a value is an array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}
