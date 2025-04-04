
/**
 * Type guard for checking if a value is a record (object)
 */
export function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard for checking if a value is an Error
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error || (
    typeof value === 'object' && 
    value !== null && 
    'message' in value && 
    typeof (value as any).message === 'string'
  );
}

/**
 * Check if a string is a valid UUID
 */
export function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Type guard for checking if a value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard for checking if a value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Type guard for checking if a value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Type guard for checking if a value is a function
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

/**
 * Type guard for checking if a value is an array
 */
export function isArray(value: unknown): value is any[] {
  return Array.isArray(value);
}

/**
 * Type guard for checking if a value is undefined or null
 */
export function isNil(value: unknown): value is null | undefined {
  return value === undefined || value === null;
}

/**
 * Type guard for checking if a value is defined (not undefined or null)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== undefined && value !== null;
}
