
/**
 * Makes details safe for logging by handling circular references and non-serializable values
 */
export function safeDetails(details: any): Record<string, any> {
  if (!details) return {};

  try {
    // Handle Error objects specially
    if (details instanceof Error) {
      return {
        name: details.name,
        message: details.message,
        stack: details.stack,
        ...(details as any) // In case it has custom properties
      };
    }
    
    // For other objects, try to make a serializable copy
    const seen = new WeakSet();
    return JSON.parse(JSON.stringify(details, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular Reference]';
        }
        seen.add(value);
      }
      
      // Handle non-serializable types
      if (typeof value === 'function') {
        return '[Function]';
      }
      if (value instanceof RegExp) {
        return value.toString();
      }
      if (value instanceof Date) {
        return value.toISOString();
      }
      if (value instanceof Promise) {
        return '[Promise]';
      }
      if (value instanceof Map) {
        return {
          _type: 'Map',
          value: Array.from(value.entries())
        };
      }
      if (value instanceof Set) {
        return {
          _type: 'Set',
          value: Array.from(value.values())
        };
      }
      
      return value;
    }));
  } catch (e) {
    // If JSON serialization fails, fallback to simple properties
    try {
      if (typeof details === 'object' && details !== null) {
        const result: Record<string, string> = {};
        
        for (const key of Object.keys(details)) {
          const value = details[key];
          if (value === null || value === undefined) {
            result[key] = String(value);
          } else if (typeof value === 'object') {
            result[key] = '[Object]';
          } else {
            result[key] = String(value);
          }
        }
        
        return result;
      }
    } catch {
      // Last resort
    }
    
    return { value: String(details) };
  }
}
