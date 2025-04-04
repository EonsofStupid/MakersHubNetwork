
/**
 * Utility type for handling JSON values from the database
 */
export type Json = 
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

/**
 * Safely convert a database JSON field to a specific type
 * @param json The JSON value from the database
 * @param defaultValue Optional default value if conversion fails
 * @returns The converted value or default value
 */
export function safeJsonParse<T>(json: Json, defaultValue: T): T {
  try {
    if (typeof json === 'string') {
      return JSON.parse(json) as T;
    }
    return json as unknown as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue;
  }
}
