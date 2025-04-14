
import React from 'react';

/**
 * Utility function to render unknown types as React nodes safely
 * @param value Any value to be rendered
 * @returns React node representation of the value
 */
export function renderUnknownAsNode(value: unknown): React.ReactNode {
  if (value === null || value === undefined) {
    return null;
  }
  
  if (React.isValidElement(value)) {
    return value;
  }
  
  if (typeof value === 'object') {
    try {
      return <pre>{JSON.stringify(value, null, 2)}</pre>;
    } catch (error) {
      return String(value);
    }
  }
  
  return String(value);
}
