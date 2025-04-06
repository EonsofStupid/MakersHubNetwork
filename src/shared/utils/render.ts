
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
      cause: error.cause ? errorToObject(error.cause) : undefined
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
  
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch (e) {
      return <span className="text-destructive">[Circular Object]</span>;
    }
  }
  
  return String(value);
}
