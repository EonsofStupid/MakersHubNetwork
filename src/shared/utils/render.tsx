
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
      // Try to spread the error object safely
      return { ...error as object };
    } catch (e) {
      // Fallback if spreading fails
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
  
  // Handle objects with safe stringification
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return '[Object]';
    }
  }
  
  // Default fallback for any other types
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
      return JSON.stringify(value);
    } catch (e) {
      return '[Object]';
    }
  }
  
  // Default fallback
  return String(value);
}
