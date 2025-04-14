import React from 'react';

/**
 * Convert an error object to a plain object for logging
 */
export function errorToObject(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error as any), // Capture any custom properties
    };
  }
  
  if (typeof error === 'object' && error !== null) {
    try {
      return { ...error as object };
    } catch (e) {
      return { value: String(error) };
    }
  }
  
  return { value: error };
}

/**
 * Safely renders any unknown value as a React node
 */
export function renderUnknownAsNode(value: unknown): React.ReactNode {
  if (value === null || value === undefined) {
    return null;
  }
  
  // Handle React elements directly
  if (React.isValidElement(value)) {
    return value;
  }
  
  // Handle primitive types
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  // Handle arrays
  if (Array.isArray(value)) {
    return (
      <span className="array-value">
        {value.map((item, index) => {
          return (
            <React.Fragment key={index}>
              {renderUnknownAsNode(item)}
              {index < value.length - 1 ? ', ' : ''}
            </React.Fragment>
          );
        })}
      </span>
    );
  }
  
  // Handle objects
  if (typeof value === 'object') {
    try {
      // Handle circular references
      const seen = new WeakSet();
      const safeString = JSON.stringify(value, (key, val) => {
        if (typeof val === 'object' && val !== null) {
          if (seen.has(val)) {
            return '[Circular]';
          }
          seen.add(val);
        }
        return val;
      }, 2);
      
      return <pre>{safeString}</pre>;
    } catch (e) {
      return '[Complex Object]';
    }
  }
  
  // Default fallback
  return String(value);
}

/**
 * Converts any value to a searchable string
 */
export function nodeToSearchableString(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (React.isValidElement(value)) {
    return 'React Element';
  }
  
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  if (Array.isArray(value)) {
    return value.map(nodeToSearchableString).join(', ');
  }
  
  if (typeof value === 'object') {
    try {
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
  
  return String(value);
} 