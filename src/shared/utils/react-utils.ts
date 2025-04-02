
import React from 'react';

/**
 * Converts a React node or any value to a searchable string
 */
export function nodeToSearchableString(value: React.ReactNode | any): string {
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
    // For React elements, we'll extract text content from simple elements
    // or return a placeholder for complex components
    const props = value.props as any;
    if (props.children && typeof props.children === 'string') {
      return props.children;
    }
    return `[React Component]`;
  }
  
  if (Array.isArray(value)) {
    return value.map(nodeToSearchableString).join(' ');
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

/**
 * Safely renders a React node or converts primitive values to strings
 */
export function safelyRenderNode(value: React.ReactNode | any): React.ReactNode {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  if (React.isValidElement(value)) {
    return value;
  }
  
  if (Array.isArray(value)) {
    return <>{value.map((item, index) => 
      <React.Fragment key={index}>{safelyRenderNode(item)}</React.Fragment>
    )}</>;
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
