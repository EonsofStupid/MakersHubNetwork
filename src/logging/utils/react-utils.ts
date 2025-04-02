
import React from 'react';

/**
 * Safely render a React node, converting non-renderable values to strings
 * @param node The React node to safely render
 * @returns A guaranteed renderable React node
 */
export function safelyRenderLogNode(node: React.ReactNode): React.ReactNode {
  if (node === null || node === undefined) {
    return '';
  }

  if (
    typeof node === 'string' || 
    typeof node === 'number' || 
    typeof node === 'boolean' ||
    React.isValidElement(node)
  ) {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(safelyRenderLogNode);
  }

  // Convert objects to string representation
  return String(node);
}

/**
 * Converts a React node to a searchable string
 * @param node The React node to convert
 * @returns A string representation of the node
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
    const componentName = (node.type as any)?.displayName || 
                         (node.type as any)?.name || 
                         'Component';
    
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
