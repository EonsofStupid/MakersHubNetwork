
import { ReactNode, isValidElement } from 'react';

/**
 * Safely renders unknown values as React nodes
 * @param input Any unknown value that needs to be rendered
 * @returns A valid React node
 */
export function renderUnknownAsNode(input: unknown): ReactNode {
  if (input === null || input === undefined) return null;
  if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') return String(input);
  if (isValidElement(input)) return input;
  if (Array.isArray(input)) return input.map(renderUnknownAsNode);
  
  // For objects, try to convert to string representation
  try {
    return JSON.stringify(input);
  } catch (error) {
    return String(input);
  }
}
