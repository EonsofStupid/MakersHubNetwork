
import { ReactNode } from 'react';

/**
 * Converts React nodes to searchable string representation
 * Used for filtering and searching in logs
 */
export function nodeToSearchableString(node: ReactNode): string {
  if (node === null || node === undefined) {
    return '';
  }
  
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
    return String(node);
  }
  
  if (Array.isArray(node)) {
    return node.map(nodeToSearchableString).join(' ');
  }
  
  if (typeof node === 'object') {
    // Handle React element
    if ('props' in node && node.props) {
      // Extract children text
      const children = node.props.children;
      if (children) {
        return nodeToSearchableString(children);
      }
    }
    
    // Try to stringify other objects
    try {
      return JSON.stringify(node);
    } catch (e) {
      return '[Complex Object]';
    }
  }
  
  return '';
}

/**
 * Gets plain text from a React node
 */
export function getPlainText(node: ReactNode): string {
  return nodeToSearchableString(node).replace(/\s+/g, ' ').trim();
}

/**
 * Safely render React node with error handling
 */
export function safelyRenderNode(node: ReactNode): ReactNode {
  try {
    return node;
  } catch (error) {
    console.error('Error rendering React node:', error);
    return `[Render Error: ${error instanceof Error ? error.message : 'Unknown error'}]`;
  }
}
