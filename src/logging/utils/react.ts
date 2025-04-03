
import React from 'react';

/**
 * Safely render a React node to a string for logging
 */
export function safelyRenderNode(node: React.ReactNode): string {
  try {
    if (node === null || node === undefined) {
      return '';
    }
    
    if (typeof node === 'string') {
      return node;
    }
    
    if (typeof node === 'number' || typeof node === 'boolean') {
      return String(node);
    }
    
    if (React.isValidElement(node)) {
      return `<${getComponentName(node)} />`;
    }
    
    if (Array.isArray(node)) {
      return '[React.Fragment]';
    }
    
    return String(node);
  } catch (error) {
    console.error('Error rendering React node to string:', error);
    return '[Error rendering node]';
  }
}

/**
 * Get component name from a React element
 */
function getComponentName(element: React.ReactElement): string {
  if (typeof element.type === 'string') {
    return element.type;
  }
  
  if (typeof element.type === 'function') {
    return element.type.displayName || element.type.name || 'Component';
  }
  
  return 'Unknown';
}

/**
 * Safely get props as string from a React element
 */
export function propsToString(props: Record<string, any>): string {
  try {
    const entries = Object.entries(props).filter(([key]) => key !== 'children');
    
    if (entries.length === 0) {
      return '';
    }
    
    return entries
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}="${value}"`;
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          return `${key}={${value}}`;
        } else {
          return `${key}={...}`;
        }
      })
      .join(' ');
  } catch (error) {
    console.error('Error converting props to string:', error);
    return '';
  }
}
