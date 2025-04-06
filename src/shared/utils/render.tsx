
import React from 'react';

/**
 * Converts an Error object to a plain object for logging and serialization
 */
export function errorToObject(error: unknown): Record<string, any> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      // Use optional chaining to avoid Error.cause error
      cause: (error as any).cause ? errorToObject((error as any).cause) : undefined
    };
  }
  
  return {
    error: String(error)
  };
}

/**
 * Renders unknown values as React nodes
 */
export function renderUnknownAsNode(value: unknown): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground italic">null</span>;
  }
  
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  if (value instanceof Error) {
    return <span className="text-destructive">{value.message}</span>;
  }
  
  if (React.isValidElement(value)) {
    return value;
  }
  
  // Handle arrays by mapping each item through renderUnknownAsNode
  if (Array.isArray(value)) {
    return (
      <span className="array-value">
        {value.map((item, index) => (
          <React.Fragment key={index}>
            {renderUnknownAsNode(item)}
            {index < value.length - 1 && ', '}
          </React.Fragment>
        ))}
      </span>
    );
  }
  
  if (typeof value === 'object') {
    try {
      // Use a replacer function to handle circular references
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
      
      return safeString;
    } catch (e) {
      return <span className="text-destructive">[Circular Object]</span>;
    }
  }
  
  return String(value);
}

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
