
import React, { ReactNode } from 'react';

/**
 * Converts various types to a string representation for search
 */
export function nodeToSearchableString(node: unknown): string {
  if (node === null || node === undefined) {
    return '';
  }
  
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
    return String(node);
  }
  
  if (typeof node === 'object') {
    if (React.isValidElement(node)) {
      // Handle React elements by getting their text content
      const props = node.props as Record<string, unknown>;
      
      if (props.children) {
        if (typeof props.children === 'string') {
          return props.children;
        } else if (Array.isArray(props.children)) {
          return props.children
            .map(child => nodeToSearchableString(child))
            .join(' ');
        }
      }
      
      return '';
    } else if (Array.isArray(node)) {
      // Handle arrays by joining their string representations
      return node.map(item => nodeToSearchableString(item)).join(' ');
    } else {
      // Handle plain objects by converting to JSON
      try {
        return JSON.stringify(node);
      } catch (e) {
        return '';
      }
    }
  }
  
  return String(node);
}

/**
 * Type guard to check if a value is a valid React node
 */
export function isValidReactNode(value: unknown): value is ReactNode {
  return (
    value === undefined ||
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    React.isValidElement(value) ||
    Array.isArray(value) ||
    typeof value === 'function'
  );
}

/**
 * Safely renders any value as a React node
 * Ensures that the output is always a valid ReactNode type
 */
export function renderUnknownAsNode(value: unknown): ReactNode {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (isValidReactNode(value)) {
    return value;
  }
  
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return (
        <>
          {value.map((item, index) => (
            <React.Fragment key={index}>
              {renderUnknownAsNode(item)}
            </React.Fragment>
          ))}
        </>
      );
    }
    
    try {
      return <pre>{JSON.stringify(value, null, 2)}</pre>;
    } catch (e) {
      return String(value);
    }
  }
  
  return String(value);
}
