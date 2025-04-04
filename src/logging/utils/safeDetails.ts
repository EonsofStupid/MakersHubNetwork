
import { isError, isRecord } from './type-guards';

/**
 * Maximum depth for recursive object exploration
 */
const MAX_DEPTH = 3;

/**
 * Keys that might contain sensitive data and should be redacted
 */
const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'key',
  'auth',
  'credential',
  'private',
  'ssn',
  'credit',
  'card',
  'access_token',
  'refresh_token',
  'jwt'
];

/**
 * Safely prepare details for logging, handling circular references,
 * max depth, and redacting sensitive information
 */
export function safeDetails(
  details: unknown, 
  depth: number = 0, 
  visited: Set<unknown> = new Set()
): Record<string, any> | undefined {
  if (details === null || details === undefined) {
    return undefined;
  }

  // Handle primitive types
  if (typeof details !== 'object') {
    return { value: details };
  }

  // Prevent circular references
  if (visited.has(details)) {
    return { circularReference: true };
  }

  // Limit recursion depth
  if (depth >= MAX_DEPTH) {
    if (Array.isArray(details)) {
      return { arrayType: `Array(${details.length})` };
    }
    return { objectType: details.constructor?.name || 'Object' };
  }

  // Track this object in our visited set
  visited.add(details);

  // Handle Error objects
  if (isError(details)) {
    return {
      name: details.name,
      message: details.message,
      stack: details.stack?.split('\n').slice(0, 5).join('\n')
    };
  }

  // Handle arrays
  if (Array.isArray(details)) {
    return {
      data: details.map(item => safeDetails(item, depth + 1, visited))
    };
  }

  // Handle objects
  if (isRecord(details)) {
    const result: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(details)) {
      // Check if the key might contain sensitive information
      const isSensitive = SENSITIVE_KEYS.some(
        sensitiveKey => key.toLowerCase().includes(sensitiveKey.toLowerCase())
      );
      
      if (isSensitive) {
        // Redact sensitive values
        result[key] = '[REDACTED]';
      } else {
        // Recursively process non-sensitive values
        result[key] = safeDetails(value, depth + 1, visited);
      }
    }
    
    return result;
  }

  // Fallback for other object types
  return { type: details.constructor?.name || 'Unknown' };
}
