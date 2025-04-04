
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
