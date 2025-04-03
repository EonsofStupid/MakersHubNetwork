
/**
 * Safely converts any value to a serializable object for logging
 * 
 * This prevents circular references and handles special types
 * which can cause issues when serializing to JSON
 */
export function safeDetails(value: unknown): Record<string, unknown> {
  try {
    if (value === null || value === undefined) {
      return { value: String(value) };
    }
    
    // Handle Error objects
    if (value instanceof Error) {
      return {
        message: value.message,
        name: value.name,
        stack: value.stack,
        ...(value as any).cause ? { cause: safeDetails((value as any).cause) } : {}
      };
    }
    
    // Handle non-POJO objects
    if (typeof value === 'object' && value !== null) {
      // If it's a Date
      if (value instanceof Date) {
        return { value: value.toISOString(), type: 'Date' };
      }
      
      // If it's a Map
      if (value instanceof Map) {
        return { 
          value: Array.from(value.entries()).reduce((obj, [k, v]) => {
            obj[String(k)] = v;
            return obj;
          }, {} as Record<string, unknown>),
          type: 'Map'
        };
      }
      
      // If it's a Set
      if (value instanceof Set) {
        return { value: Array.from(value), type: 'Set' };
      }
      
      // If it's an Array
      if (Array.isArray(value)) {
        return value.map(item => {
          if (typeof item === 'object' && item !== null) {
            return safeDetails(item);
          }
          return item;
        });
      }
      
      // For regular objects, recursively handle properties
      const result: Record<string, unknown> = {};
      
      // Limit recursion to direct properties for safety
      Object.keys(value).forEach(key => {
        const prop = (value as Record<string, unknown>)[key];
        
        if (typeof prop === 'function') {
          result[key] = '[Function]';
        } else if (typeof prop === 'object' && prop !== null) {
          // Simplified handling for nested objects to prevent deep recursion
          if (prop instanceof Date) {
            result[key] = prop.toISOString();
          } else if (prop instanceof Error) {
            result[key] = { message: prop.message, name: prop.name };
          } else {
            try {
              // Only include a shallow representation of nested objects
              result[key] = Object.keys(prop).reduce((obj, nestedKey) => {
                const val = (prop as Record<string, unknown>)[nestedKey];
                if (typeof val !== 'object' && typeof val !== 'function') {
                  obj[nestedKey] = val;
                } else if (val instanceof Date) {
                  obj[nestedKey] = val.toISOString();
                } else if (val === null) {
                  obj[nestedKey] = null;
                } else {
                  obj[nestedKey] = `[${Array.isArray(val) ? 'Array' : typeof val}]`;
                }
                return obj;
              }, {} as Record<string, unknown>);
            } catch (err) {
              result[key] = `[Object: conversion error]`;
            }
          }
        } else {
          result[key] = prop;
        }
      });
      
      return result;
    }
    
    // For primitive values
    return { value };
  } catch (error) {
    return { 
      error: 'Error converting details to safe format', 
      originalType: typeof value 
    };
  }
}
