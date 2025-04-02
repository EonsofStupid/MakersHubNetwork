
/**
 * Utility functions for working with React nodes
 */

import React from 'react';

/**
 * Converts a React node to a searchable string
 * - For strings, numbers, and booleans, returns the value as a string
 * - For arrays, converts each item recursively and joins them
 * - For objects with a type property (React components), returns the component name if available
 * - For other objects, tries to convert them to a string
 */
export function nodeToSearchableString(node: React.ReactNode): string {
  if (node === null || node === undefined) {
    return '';
  }

  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(nodeToSearchableString).join(' ');
  }

  if (React.isValidElement(node)) {
    // Try to get component name
    const componentName = (node.type as any)?.displayName || (node.type as any)?.name || 'Component';
    
    // Also process children if available
    const childrenString = node.props.children 
      ? nodeToSearchableString(node.props.children) 
      : '';
    
    return `${componentName} ${childrenString}`.trim();
  }

  // Handle objects that might have a toString method
  if (typeof node === 'object') {
    try {
      return String(node);
    } catch (e) {
      return '[Object]';
    }
  }

  return '';
}
