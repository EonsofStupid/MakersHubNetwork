
import React from 'react';
import { isString } from './type-guards';

/**
 * Safely render potentially non-string/non-React node values
 */
export function safelyRenderNode(node: unknown): React.ReactNode {
  if (node === null || node === undefined) {
    return '';
  }
  
  if (React.isValidElement(node)) {
    return node;
  }
  
  if (isString(node) || typeof node === 'number' || typeof node === 'boolean') {
    return String(node);
  }
  
  if (Array.isArray(node)) {
    return '[Array]';
  }
  
  if (typeof node === 'object') {
    try {
      return JSON.stringify(node);
    } catch (e) {
      return '[Object]';
    }
  }
  
  return String(node);
}

/**
 * Convert a React node to a searchable string
 */
export function nodeToSearchableString(node: unknown): string {
  if (node === null || node === undefined) {
    return '';
  }
  
  if (React.isValidElement(node)) {
    // For simple React elements, try to extract text content
    const props = node.props;
    if (props.children) {
      if (isString(props.children)) {
        return props.children;
      }
      
      if (Array.isArray(props.children)) {
        return props.children
          .map(child => nodeToSearchableString(child))
          .join(' ');
      }
    }
    
    return '';
  }
  
  if (isString(node) || typeof node === 'number' || typeof node === 'boolean') {
    return String(node);
  }
  
  if (Array.isArray(node)) {
    return node.map(item => nodeToSearchableString(item)).join(' ');
  }
  
  if (typeof node === 'object') {
    try {
      return JSON.stringify(node);
    } catch (e) {
      return '';
    }
  }
  
  return String(node);
}
