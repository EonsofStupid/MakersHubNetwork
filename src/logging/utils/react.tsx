
import React from 'react';
import { isString, isNumber, isBoolean, isRecord } from './type-guards';

/**
 * Safely render a React node as a string for searching/filtering
 */
export function nodeToSearchableString(node: React.ReactNode): string {
  if (node === null || node === undefined) {
    return '';
  }
  
  if (isString(node) || isNumber(node) || isBoolean(node)) {
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
  
  if (isRecord(node)) {
    try {
      return JSON.stringify(node);
    } catch {
      return '[Complex Object]';
    }
  }
  
  return '';
}

/**
 * Safely render a node for display in logs
 */
export function safelyRenderNode(node: React.ReactNode): React.ReactNode {
  if (node === null || node === undefined) {
    return '';
  }
  
  if (isString(node) || isNumber(node) || isBoolean(node)) {
    return String(node);
  }
  
  if (React.isValidElement(node)) {
    return nodeToSearchableString(node);
  }
  
  if (isRecord(node)) {
    try {
      return JSON.stringify(node);
    } catch {
      return '[Complex Object]';
    }
  }
  
  if (Array.isArray(node)) {
    return node.map(safelyRenderNode).join(', ');
  }
  
  return String(node);
}
