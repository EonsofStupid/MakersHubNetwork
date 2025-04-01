
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

/**
 * Converts a React node to a searchable string representation
 */
export function nodeToSearchableString(value: React.ReactNode): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  if (React.isValidElement(value)) {
    try {
      // Try to extract text content from props or children
      const props = value.props || {};
      if (typeof props.children === 'string') {
        return props.children;
      }
      return '';
    } catch (e) {
      return '';
    }
  }
  
  if (Array.isArray(value)) {
    try {
      return value.map(item => nodeToSearchableString(item)).join(' ');
    } catch (e) {
      return '';
    }
  }
  
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return '';
    }
  }
  
  return String(value);
}

/**
 * A React component that safely renders unknown values
 */
export function SafeRender({ value }: { value: unknown }): React.ReactNode {
  return <>{renderUnknownAsNode(value)}</>;
}
