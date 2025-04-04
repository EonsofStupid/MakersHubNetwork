
import React from 'react';

/**
 * Safely renders a node by converting it to a string if needed
 * This handles ReactNode and other values safely
 * 
 * @param node The node to render, can be a ReactNode or any value
 * @returns A safe representation of the node
 */
export function safelyRenderNode(node: unknown): React.ReactNode {
  // Handle null and undefined
  if (node === null || node === undefined) {
    return '';
  }

  // If it's already a valid React node, return it
  if (
    React.isValidElement(node) ||
    typeof node === 'string' ||
    typeof node === 'number' ||
    typeof node === 'boolean'
  ) {
    return node;
  }

  // Handle Error objects
  if (node instanceof Error) {
    return node.message;
  }
  
  // Handle arrays
  if (Array.isArray(node)) {
    return JSON.stringify(node);
  }

  // Handle objects and everything else
  try {
    return typeof node === 'object' ? JSON.stringify(node) : String(node);
  } catch (e) {
    return '[Complex Object]';
  }
}
