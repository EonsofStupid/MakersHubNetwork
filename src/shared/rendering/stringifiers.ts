
import { RenderOptions, StringifyOptions } from './types';
import { ReactNode } from 'react';

/**
 * Safely stringify objects for debugging or display
 */
export function safeStringify(
  value: unknown,
  options: StringifyOptions = {}
): string {
  const {
    maxDepth = 3,
    maxLength = 1000,
    fallback = '[Complex Object]',
    handleCircular = true,
  } = options;

  try {
    if (value === null || value === undefined) {
      return 'null';
    }

    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return String(value);
    }

    if (value instanceof Error) {
      return value.message;
    }

    if (typeof value === 'object') {
      // Handle circular references with WeakSet
      const seen = handleCircular ? new WeakSet() : null;
      
      const replacer = handleCircular
        ? (key: string, val: any) => {
            if (typeof val === 'object' && val !== null) {
              if (seen && seen.has(val)) {
                return '[Circular]';
              }
              if (seen) seen.add(val);
            }
            return val;
          }
        : null;

      const stringified = JSON.stringify(value, replacer as any, 2);
      
      // Truncate if too long
      if (stringified.length > maxLength) {
        return stringified.substring(0, maxLength) + '...';
      }
      
      return stringified;
    }

    return String(value);
  } catch (e) {
    return fallback;
  }
}

/**
 * Convert a React node to a searchable string
 */
export function nodeToSearchableString(node: ReactNode | unknown): string {
  if (node === null || node === undefined) {
    return '';
  }

  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
    return String(node);
  }

  if (node instanceof Error) {
    return `${node.name}: ${node.message}`;
  }

  if (React.isValidElement(node)) {
    // For React elements, try to extract text content
    const props = node.props as any;
    
    if (props.children) {
      if (typeof props.children === 'string' || typeof props.children === 'number') {
        return String(props.children);
      }
      
      if (Array.isArray(props.children)) {
        return props.children
          .map((child: any) => nodeToSearchableString(child))
          .join(' ')
          .trim();
      }
    }
    
    return `[${node.type.toString()}]`;
  }
  
  if (Array.isArray(node)) {
    return node.map(nodeToSearchableString).join(' ').trim();
  }

  if (typeof node === 'object' && node !== null) {
    try {
      return safeStringify(node);
    } catch (e) {
      return '[Object]';
    }
  }

  return String(node);
}

/**
 * Convert an error to a plain object for logging
 */
export function errorToObject(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error as any)
    };
  }
  
  if (typeof error === 'object' && error !== null) {
    return { ...error as Record<string, unknown> };
  }
  
  return { value: error };
}
