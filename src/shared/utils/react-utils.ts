
import React, { isValidElement, Fragment, ReactNode } from 'react';

/**
 * Type guard for renderable React nodes
 */
export function isReactRenderable(value: unknown): value is ReactNode {
  return (
    value == null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    isValidElement(value) ||
    (Array.isArray(value) && value.every(isReactRenderable))
  );
}

/**
 * Safely renders unknown values into ReactNode
 */
export function safelyRenderNode(value: unknown): ReactNode {
  if (isReactRenderable(value)) return value;

  if (typeof value === 'object') {
    try {
      const stringified = JSON.stringify(value, null, 2);
      return React.createElement(Fragment, null, stringified);
    } catch {
      return React.createElement(Fragment, null, '[Unrenderable Object]');
    }
  }

  return React.createElement(Fragment, null, String(value));
}

/**
 * Converts a React node to a searchable string representation
 */
export function nodeToSearchableString(value: ReactNode): string {
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
    try {
      // Try to extract text content from props or children
      const props = value.props || {};
      if (typeof props.children === 'string') {
        return props.children;
      }
      return '';
    } catch (e) {
      return '';
    }
  }
  
  if (Array.isArray(value)) {
    try {
      return value.map(item => nodeToSearchableString(item)).join(' ');
    } catch (e) {
      return '';
    }
  }
  
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return '';
    }
  }
  
  return String(value);
}

/**
 * @deprecated Use isReactRenderable instead for more accurate type checking
 */
export function isReactNode(value: unknown): value is React.ReactNode {
  return (
    value === undefined ||
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    React.isValidElement(value) ||
    Array.isArray(value)
  );
}
