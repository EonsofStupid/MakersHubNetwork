
import React from 'react';

/**
 * Type guard to check if a value is a valid React node
 */
export function isReactNode(value: unknown): value is React.ReactNode {
  return (
    value === undefined ||
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    React.isValidElement(value) ||
    Array.isArray(value)
  );
}

/**
 * Safely converts unknown values to React nodes
 * Similar to renderUnknownAsNode but with type safety
 */
export function safelyRenderNode(value: unknown): React.ReactNode {
  if (isReactNode(value)) {
    return value;
  }
  
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return '[Object]';
    }
  }
  
  return String(value);
}
