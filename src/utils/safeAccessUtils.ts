
/**
 * Safely access nested properties with fallback
 * This is useful for avoiding "cannot read property of undefined" errors
 */
export function getSafeProperty<T>(
  obj: unknown,
  path: string[],
  fallback: T
): T {
  try {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
      return fallback;
    }
    
    let current: any = obj;
    
    for (const key of path) {
      if (current === null || current === undefined) {
        return fallback;
      }
      current = current[key];
    }
    
    return (current !== null && current !== undefined) ? current : fallback;
  } catch (error) {
    console.warn(`Error accessing property path: ${path.join('.')}`);
    return fallback;
  }
}

/**
 * Safely access a theme color value with fallback
 */
export function getThemeColor(theme: any, path: string, fallback: string = '#000000'): string {
  return getSafeProperty(theme, ['colors', ...path.split('.')], fallback);
}

/**
 * Safely parse JSON with fallback
 */
export function safeParseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn('Failed to parse JSON', error);
    return fallback;
  }
}

/**
 * Safely stringify JSON with fallback
 */
export function safeStringifyJson(value: unknown, fallback: string = '{}'): string {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.warn('Failed to stringify JSON', error);
    return fallback;
  }
}

/**
 * Safely get the keys of an object
 */
export function safeObjectKeys(obj: unknown): string[] {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    return Object.keys(obj);
  }
  return [];
}

/**
 * Safely get value from a Record with fallback
 */
export function safeGetFromRecord<T>(
  record: Record<string, T> | undefined | null,
  key: string,
  fallback: T
): T {
  if (!record) return fallback;
  return record[key] !== undefined ? record[key] : fallback;
}

/**
 * Safely check if a value is included in an array
 */
export function safeIncludes<T>(array: T[] | undefined | null, value: T): boolean {
  if (!array || !Array.isArray(array)) return false;
  return array.includes(value);
}

/**
 * Safely convert any value to a string
 */
export function safeToString(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return '[Object]';
    }
  }
  return String(value);
}
