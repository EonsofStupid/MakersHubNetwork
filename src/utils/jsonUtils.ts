
import { Json } from '@/types/json';

/**
 * Safely convert any value to a valid JSON type
 * Use this when sending data to Supabase or other external services
 */
export function toSafeJson<T>(obj: T): Json {
  return JSON.parse(JSON.stringify(obj)) as Json;
}

/**
 * Safely parse JSON with error handling
 */
export function safeJsonParse<T>(json: string | Json, fallback: T): T {
  try {
    if (typeof json === 'string') {
      return JSON.parse(json) as T;
    }
    return json as T;
  } catch (error) {
    console.warn('Error parsing JSON', error);
    return fallback;
  }
}

/**
 * Check if a value can be safely converted to JSON
 */
export function isSafeJson(value: unknown): boolean {
  try {
    JSON.stringify(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Create a deep copy of an object using JSON serialization
 */
export function deepCloneJson<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

/**
 * Safely stringify an object to JSON with error handling
 */
export function safeStringify(value: any, fallback: string = '{}'): string {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.warn('Error stringifying object', error);
    return fallback;
  }
}

/**
 * Extract only JSON-compatible values from an object
 */
export function extractJsonValues<T extends Record<string, any>>(obj: T): Record<string, Json> {
  const result: Record<string, Json> = {};
  
  for (const key in obj) {
    try {
      const value = obj[key];
      // Skip undefined values and functions
      if (value === undefined || typeof value === 'function') continue;
      
      // Test if value can be safely converted to JSON
      const json = JSON.stringify(value);
      result[key] = JSON.parse(json);
    } catch {
      // Skip values that can't be converted to JSON
    }
  }
  
  return result;
}

/**
 * Utility function for deep merging of objects
 */
export function deepMerge<T extends object = object, U extends object = T>(target: T, source: U): T & U {
  const output = { ...target } as T & U;
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key as keyof U])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key as keyof U] });
        } else {
          output[key as keyof (T & U)] = deepMerge(
            target[key as keyof T] as object,
            source[key as keyof U] as object
          ) as any;
        }
      } else {
        Object.assign(output, { [key]: source[key as keyof U] });
      }
    });
  }
  
  return output;
}

function isObject(item: any): item is object {
  return item && typeof item === 'object' && !Array.isArray(item);
}
