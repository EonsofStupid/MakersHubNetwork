
import React from 'react';
import { isString, isNumber, isBoolean } from './type-guards';

/**
 * Safely render a React node or primitive value
 */
export function safelyRenderNode(node: React.ReactNode | string | number | boolean): React.ReactNode {
  if (React.isValidElement(node)) {
    return node;
  }
  
  if (isString(node) || isNumber(node) || isBoolean(node)) {
    return String(node);
  }
  
  return '[Complex Object]';
}

/**
 * Convert a React node to a searchable string for filtering
 */
export function nodeToSearchableString(node: React.ReactNode): string {
  if (React.isValidElement(node)) {
    // Try to extract text content from element
    const props = node.props as Record<string, unknown>;
    
    if (props.children) {
      if (isString(props.children) || isNumber(props.children) || isBoolean(props.children)) {
        return String(props.children);
      }
      
      if (Array.isArray(props.children)) {
        return props.children
          .map(child => nodeToSearchableString(child))
          .join(' ');
      }
    }
    
    return '';
  }
  
  if (isString(node) || isNumber(node) || isBoolean(node)) {
    return String(node);
  }
  
  return '';
}
