
import React from 'react';

/**
 * Safely renders any unknown value as a React node
 */
export function renderUnknownAsNode(value: unknown): React.ReactNode {
  if (value === null || value === undefined) {
    return null;
  }
  
  if (React.isValidElement(value)) {
    return value;
  }
  
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  if (typeof value === 'object') {
    try {
      // Handle arrays specifically
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
      
      // Safe stringify for objects
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
  if (React.isValidElement(value)) {
    // Extract text from React elements - simplified approach
    return 'React Element';
  }
  
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  if (typeof value === 'object') {
    try {
      // Handle arrays specifically
      if (Array.isArray(value)) {
        return value.map(nodeToSearchableString).join(', ');
      }
      
      return JSON.stringify(value);
    } catch (e) {
      return '[Object]';
    }
  }
  
  return String(value);
}
