
/**
 * JSON type that matches what Supabase expects for JSON columns
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]
  
/**
 * Utility function to safely convert any value to a valid JSON type
 */
export function toJson<T>(value: T): Json {
  return JSON.parse(JSON.stringify(value)) as Json;
}

/**
 * Type guard to check if a value is a valid JSON
 */
export function isJson(value: unknown): value is Json {
  if (value === null) return true;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return true;
  if (Array.isArray(value)) return value.every(isJson);
  if (typeof value === 'object') {
    for (const key in value) {
      // @ts-ignore - we're checking if it's an object with properties
      if (!isJson(value[key])) return false;
    }
    return true;
  }
  return false;
}

/**
 * Re-export the utility functions from jsonUtils.ts for broader usage
 */
export { toSafeJson, safeJsonParse, isSafeJson } from '@/utils/jsonUtils';
