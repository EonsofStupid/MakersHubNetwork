
import { ReactNode } from 'react';

/**
 * Utility functions for rendering components
 */

// Function to conditionally render a component
export function renderIf<T>(condition: boolean, component: ReactNode): ReactNode | null {
  return condition ? component : null;
}

// Function to map an array to components
export function renderMap<T>(
  items: T[],
  renderItem: (item: T, index: number) => ReactNode
): ReactNode[] {
  return items.map(renderItem);
}

// Function to render based on a value being present
export function renderWhen<T>(
  value: T | null | undefined,
  renderFn: (value: T) => ReactNode
): ReactNode | null {
  return value ? renderFn(value) : null;
}

// Function to convert object to string in a safe way
export function renderUnknownAsNode(value: unknown): ReactNode {
  if (value === null || value === undefined) {
    return null;
  }
  
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value.toString();
  }
  
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }
  
  return JSON.stringify(value);
}

// Converts an error object to a plain object
export function errorToObject(error: unknown): Record<string, unknown> {
  if (!error) return { message: 'Unknown error' };
  
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      stack: error.stack,
      ...(error as any),
    };
  }
  
  if (typeof error === 'object') {
    return { ...error as object };
  }
  
  return { message: String(error) };
}

// Converts a string to a URL-friendly slug
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}
