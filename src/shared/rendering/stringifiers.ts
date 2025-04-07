
import React from 'react';

/**
 * Converts any value to a searchable string
 */
export function nodeToSearchableString(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  // Handle React elements
  if (React.isValidElement(value)) {
    return 'React Element';
  }
  
  // Handle primitive types
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(nodeToSearchableString).join(', ');
  }
  
  // Handle objects
  if (typeof value === 'object') {
    try {
      // Use a replacer function to handle circular references
      const seen = new WeakSet();
      return JSON.stringify(value, (key, val) => {
        if (typeof val === 'object' && val !== null) {
          if (seen.has(val)) {
            return '[Circular]';
          }
          seen.add(val);
        }
        return val;
      });
    } catch (e) {
      return '[Complex Object]';
    }
  }
  
  // Default fallback
  return String(value);
}

/**
 * Converts an Error object to a plain object for logging and serialization
 */
export function errorToObject(error: unknown): Record<string, any> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: (error as any).cause ? errorToObject((error as any).cause) : undefined
    };
  }
  
  return {
    error: String(error)
  };
}
