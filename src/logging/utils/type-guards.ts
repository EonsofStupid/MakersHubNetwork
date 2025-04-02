
/**
 * Type guards for working with unknown types in logging
 */

/**
 * Check if a value is an Error
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Check if a value is a Record (object)
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Check if a value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Check if a value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Check if a value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Check if a string is a valid UUID
 * RFC4122 compliant UUID validation
 */
export function isValidUUID(value: string | unknown): boolean {
  if (typeof value !== 'string' || !value) return false;
  
  // RFC4122 compliant UUID format - improved regex for better validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Generate a valid v4 UUID
 * Using crypto.randomUUID() if available (for better security and performance)
 * With improved fallback to RFC4122 v4 implementation
 */
export function generateUUID(): string {
  try {
    // Use crypto.randomUUID when available (browser & modern Node.js)
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    
    // Modern fallback using Web Crypto API
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      const buf = new Uint16Array(8);
      crypto.getRandomValues(buf);
      return (
        buf[0].toString(16).padStart(4, '0') +
        buf[1].toString(16).padStart(4, '0') +
        '-' +
        buf[2].toString(16).padStart(4, '0') +
        '-' +
        ((buf[3] & 0x0fff) | 0x4000).toString(16).padStart(4, '0') +
        '-' +
        ((buf[4] & 0x3fff) | 0x8000).toString(16).padStart(4, '0') +
        '-' +
        buf[5].toString(16).padStart(4, '0') +
        buf[6].toString(16).padStart(4, '0') +
        buf[7].toString(16).padStart(4, '0')
      );
    }
    
    // Last resort fallback implementation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  } catch (e) {
    // Absolute last resort if all else fails
    console.error('Error generating UUID:', e);
    return [
      Math.random().toString(36).substring(2, 10),
      Math.random().toString(36).substring(2, 10),
      Math.random().toString(36).substring(2, 6),
      Math.random().toString(36).substring(2, 6),
      Date.now().toString(36)
    ].join('-');
  }
}

/**
 * Safely convert any value to a details object for logging
 */
export function toLogDetails(value: unknown): Record<string, unknown> {
  if (isRecord(value)) {
    return Object.entries(value).reduce((acc, [key, val]) => {
      // Handle Error objects specially
      if (val instanceof Error) {
        acc[key] = {
          message: val.message,
          name: val.name,
          stack: val.stack,
          ...(val as any) // Include any custom properties on the error
        };
      } else if (typeof val === 'function') {
        // Skip functions
        acc[key] = '[Function]';
      } else if (typeof val === 'symbol') {
        // Convert symbols to strings
        acc[key] = val.toString();
      } else if (val === undefined) {
        // Skip undefined values
        acc[key] = '[undefined]';
      } else if (val === null) {
        // Include null values
        acc[key] = null;
      } else if (typeof val === 'object') {
        try {
          // Try to convert objects (including arrays) recursively
          acc[key] = toLogDetails(val);
        } catch (e) {
          // If that fails, use JSON stringify as a fallback
          try {
            acc[key] = JSON.parse(JSON.stringify(val));
          } catch (e2) {
            acc[key] = '[Unstringifiable Object]';
          }
        }
      } else {
        // Primitives can be used directly
        acc[key] = val;
      }
      return acc;
    }, {} as Record<string, unknown>);
  } else if (isError(value)) {
    return {
      message: value.message,
      name: value.name,
      stack: value.stack,
      ...(value as any) // Include any custom properties on the error
    };
  } else if (Array.isArray(value)) {
    return { array: value.map(item => (typeof item === 'object' && item !== null) ? toLogDetails(item) : item) };
  } else if (value === null) {
    return { value: null };
  } else if (value === undefined) {
    return { value: '[undefined]' };
  } else if (typeof value === 'function') {
    return { value: '[Function]' };
  } else if (typeof value === 'symbol') {
    return { value: value.toString() };
  } else if (typeof value === 'object') {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (e) {
      return { value: '[Unstringifiable Object]' };
    }
  } else {
    // For primitives, wrap in an object
    return { value };
  }
}
