
import { ReactNode } from 'react';

/**
 * Safely render a React node as a string for logging
 */
export function safelyRenderNode(node: ReactNode): string {
  if (node === null || node === undefined) {
    return '';
  }
  
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
    return String(node);
  }
  
  if (Array.isArray(node)) {
    try {
      return JSON.stringify(node);
    } catch {
      return '[Array]';
    }
  }
  
  // Handle Error objects
  if (node instanceof Error) {
    return node.message;
  }
  
  if (typeof node === 'object') {
    try {
      if ('message' in node && typeof node.message === 'string') {
        return node.message;
      }
      return JSON.stringify(node);
    } catch {
      return '[Complex Object]';
    }
  }
  
  return '[React Node]';
}

/**
 * Convert a React Node to a searchable string for filtering logs
 */
export function nodeToSearchableString(node: ReactNode): string {
  return safelyRenderNode(node).toLowerCase();
}

/**
 * Check if a value is an Error
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error || 
    (typeof value === 'object' && 
     value !== null && 
     'message' in value && 
     typeof (value as any).message === 'string');
}
