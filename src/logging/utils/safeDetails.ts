
/**
 * Safely format object details for logging
 * This utility sanitizes objects to make them safe for serialization
 */
export function safeDetails(details: unknown): Record<string, unknown> {
  if (details === null || details === undefined) {
    return { value: String(details) };
  }
  
  if (typeof details === 'object') {
    if (Array.isArray(details)) {
      // Handle arrays by converting to an object with numeric keys
      return details.reduce((acc, item, index) => {
        acc[String(index)] = safeValue(item);
        return acc;
      }, {} as Record<string, unknown>);
    }
    
    try {
      // Process regular objects
      const result: Record<string, unknown> = {};
      
      // Use Object.entries to handle all types of objects safely
      Object.entries(details as Record<string, unknown>).forEach(([key, value]) => {
        result[key] = safeValue(value);
      });
      
      return result;
    } catch (err) {
      return { error: 'Unsanitizable object', toString: String(details) };
    }
  }
  
  // Handle primitives
  return { value: String(details) };
}

/**
 * Process individual values to ensure they're safe for serialization
 */
function safeValue(value: unknown): unknown {
  if (value === null || value === undefined) {
    return String(value);
  }
  
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return value.map(safeValue);
    }
    
    try {
      if (value instanceof Error) {
        return {
          message: value.message,
          name: value.name,
          stack: value.stack
        };
      }
      
      // Generic object handling
      const result: Record<string, unknown> = {};
      
      Object.entries(value as Record<string, unknown>).forEach(([k, v]) => {
        // Skip functions and circular references
        if (typeof v !== 'function') {
          result[k] = safeValue(v);
        }
      });
      
      return result;
    } catch (err) {
      return String(value);
    }
  }
  
  // Functions become their string representation
  if (typeof value === 'function') {
    return '[Function]';
  }
  
  // Pass primitives through
  return value;
}
