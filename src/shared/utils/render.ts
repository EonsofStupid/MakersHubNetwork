
/**
 * Utility functions for rendering and converting between different formats
 */

import React from 'react';

/**
 * Convert an error object to a plain object for logging
 */
export function errorToObject(error: unknown): Record<string, any> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      causeMessage: (error as any).cause?.message,
      causeStack: (error as any).cause?.stack,
    };
  }
  
  if (typeof error === 'object' && error !== null) {
    return { ...error as Record<string, any> };
  }
  
  return { value: String(error) };
}

/**
 * Convert a React node to a searchable string
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
    const children = node.props.children;
    return nodeToSearchableString(children);
  }
  
  return String(node);
}

/**
 * Render any value as a React node
 */
export function renderUnknownAsNode(value: unknown): React.ReactNode {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  if (React.isValidElement(value)) {
    return value;
  }
  
  if (Array.isArray(value)) {
    return value.map((item, index) => (
      <span key={index}>{renderUnknownAsNode(item)}</span>
    ));
  }
  
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return '[Object]';
    }
  }
  
  return String(value);
}
