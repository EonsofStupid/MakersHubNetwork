
import React from 'react';
import { StringifyOptions } from './types';

/**
 * Converts any value to a searchable string
 */
export function nodeToSearchableString(value: unknown, options?: StringifyOptions): string {
  const { maxLength = 1000, handleCircular = true, fallback = '' } = options || {};
  
  if (value === null || value === undefined) {
    return '';
  }
  
  // Handle React elements
  if (React.isValidElement(value)) {
    return 'React Element';
  }
  
  // Handle primitive types
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    const stringValue = String(value);
    return maxLength && stringValue.length > maxLength ? stringValue.substring(0, maxLength) + '...' : stringValue;
  }
  
  // Handle arrays
  if (Array.isArray(value)) {
    const result = value.map(item => nodeToSearchableString(item, { 
      maxLength: Math.floor(maxLength / value.length), 
      handleCircular 
    })).join(', ');
    
    return maxLength && result.length > maxLength ? result.substring(0, maxLength) + '...' : result;
  }
  
  // Handle objects
  if (typeof value === 'object') {
    try {
      // Use a replacer function to handle circular references if enabled
      if (handleCircular) {
        const seen = new WeakSet();
        const stringified = JSON.stringify(value, (key, val) => {
          if (typeof val === 'object' && val !== null) {
            if (seen.has(val)) {
              return '[Circular]';
            }
            seen.add(val);
          }
          return val;
        });
        return maxLength && stringified.length > maxLength ? stringified.substring(0, maxLength) + '...' : stringified;
      } else {
        const stringified = JSON.stringify(value);
        return maxLength && stringified.length > maxLength ? stringified.substring(0, maxLength) + '...' : stringified;
      }
    } catch (e) {
      return '[Complex Object]';
    }
  }
  
  // Default fallback
  return String(value) || fallback;
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
