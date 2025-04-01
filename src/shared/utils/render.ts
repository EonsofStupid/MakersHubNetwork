
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
    // Check if object has a custom toString method
    if (input instanceof Error) {
      return input.message;
    }
    
    if (typeof input === 'object' && input !== null) {
      // Handle Date objects
      if (input instanceof Date) {
        return input.toISOString();
      }
      
      // Handle objects with toString method
      if (typeof (input as any).toString === 'function' && 
          (input as any).toString !== Object.prototype.toString) {
        return (input as any).toString();
      }
      
      // For regular objects, stringify them
      return JSON.stringify(input);
    }
    
    return String(input);
  } catch (error) {
    return String(input);
  }
}
