
import React, { ReactNode } from 'react';

/**
 * Convert any error to a plain object
 */
export function errorToObject(error: unknown): Record<string, unknown> {
  if (error === null || error === undefined) {
    return { message: 'Unknown error' };
  }
  
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      // Use optional chaining to avoid TS error about 'cause' not existing on Error
      cause: error?.cause ? errorToObject(error.cause) : undefined
    };
  }
  
  if (typeof error === 'object') {
    try {
      // Try to convert to plain object
      return { ...error as Record<string, unknown> };
    } catch {
      return { message: String(error) };
    }
  }
  
  return { message: String(error) };
}

/**
 * Render an unknown value as a React node
 */
export function renderUnknownAsNode(value: unknown): ReactNode {
  if (value === null || value === undefined) {
    return null;
  }
  
  if (React.isValidElement(value)) {
    return value;
  }
  
  if (typeof value === 'object') {
    try {
      return <pre>{JSON.stringify(value, null, 2)}</pre>;
    } catch {
      return String(value);
    }
  }
  
  return String(value);
}

/**
 * Convert a React node to a searchable string
 */
export function nodeToSearchableString(node: ReactNode): string {
  if (node === null || node === undefined) {
    return '';
  }
  
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
    return String(node);
  }
  
  if (React.isValidElement(node)) {
    const children = node.props.children;
    if (children) {
      if (Array.isArray(children)) {
        return children.map(nodeToSearchableString).join(' ');
      }
      return nodeToSearchableString(children);
    }
    return '';
  }
  
  if (Array.isArray(node)) {
    return node.map(nodeToSearchableString).join(' ');
  }
  
  return String(node);
}
