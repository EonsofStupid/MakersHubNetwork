
// This file might not exist yet, so creating it with placeholder content that doesn't have syntax errors
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
