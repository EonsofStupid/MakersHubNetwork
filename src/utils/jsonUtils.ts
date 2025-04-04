
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

const logger = useLogger('JsonUtils', { category: LogCategory.DATA });

/**
 * Safely parse JSON with error handling
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    logger.warn('Error parsing JSON', { details: { error } });
    return fallback;
  }
}

/**
 * Safely stringify an object with error handling
 */
export function safeJsonStringify(data: any, fallback: string = '{}'): string {
  try {
    return JSON.stringify(data);
  } catch (error) {
    logger.warn('Error stringifying object to JSON', { details: { error } });
    return fallback;
  }
}

/**
 * Convert object to JSON-compatible format
 * Useful for converting complex objects to JSON-safe objects
 */
export function toJsonSafe(data: any): any {
  if (data === null || data === undefined) {
    return null;
  }
  
  if (data instanceof Date) {
    return data.toISOString();
  }
  
  if (Array.isArray(data)) {
    return data.map(item => toJsonSafe(item));
  }
  
  if (typeof data === 'object') {
    const result: Record<string, any> = {};
    for (const key in data) {
      // Skip functions and private properties
      if (typeof data[key] !== 'function' && !key.startsWith('_')) {
        result[key] = toJsonSafe(data[key]);
      }
    }
    return result;
  }
  
  // Return primitive values as-is
  return data;
}

/**
 * Safely convert JSON from DB to specified type
 */
export function dbJsonToType<T>(jsonData: any, defaultValue: T): T {
  if (!jsonData) {
    return defaultValue;
  }
  
  try {
    // Handle case where data is already parsed
    if (typeof jsonData === 'object' && !Array.isArray(jsonData)) {
      return jsonData as T;
    }
    
    // Handle case where data is a JSON string
    if (typeof jsonData === 'string') {
      return JSON.parse(jsonData) as T;
    }
    
    return defaultValue;
  } catch (error) {
    logger.error('Error converting DB JSON to type', { details: { error } });
    return defaultValue;
  }
}
