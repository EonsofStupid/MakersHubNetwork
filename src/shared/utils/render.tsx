
import React from 'react';

/**
 * Safely renders unknown values as React nodes
 */
export function renderUnknownAsNode(value: unknown): React.ReactNode {
  if (value === null || value === undefined) {
    return null;
  }
  
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  if (React.isValidElement(value)) {
    return value;
  }
  
  if (Array.isArray(value)) {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return '[Array]';
    }
  }
  
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
