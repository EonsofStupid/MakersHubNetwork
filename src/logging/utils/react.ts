
import React from 'react';

/**
 * Safely render a React node as a string
 */
export function nodeToSearchableString(node: React.ReactNode): string {
  if (node === null || node === undefined) {
    return '';
  }
  
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
    return String(node);
  }
  
  if (React.isValidElement(node)) {
    const props = node.props;
    
    // Extract text content from children
    if (props && props.children) {
      return nodeToSearchableString(props.children);
    }
    
    return '';
  }
  
  if (Array.isArray(node)) {
    return node.map(nodeToSearchableString).join(' ');
  }
  
  return '';
}

/**
 * Safely render a node for display in logs
 */
export function safelyRenderNode(node: React.ReactNode): React.ReactNode {
  if (React.isValidElement(node)) {
    // Return a simplified version for logging
    return nodeToSearchableString(node);
  }
  
  if (node === null || node === undefined) {
    return '';
  }
  
  if (typeof node === 'object' && !React.isValidElement(node)) {
    try {
      return JSON.stringify(node);
    } catch (error) {
      return '[Complex Object]';
    }
  }
  
  return node;
}
