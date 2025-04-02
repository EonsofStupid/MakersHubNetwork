
import React from 'react';

/**
 * Safely render a React node as a searchable string
 */
export function nodeToSearchableString(node: React.ReactNode): string {
  if (node === null || node === undefined) {
    return '';
  }
  
  if (typeof node === 'string') {
    return node;
  }
  
  if (typeof node === 'number' || typeof node === 'boolean') {
    return String(node);
  }
  
  if (React.isValidElement(node)) {
    const props = node.props as Record<string, unknown>;
    let content = '';
    
    // Extract text content from children
    if (props.children) {
      content = nodeToSearchableString(props.children);
    }
    
    // Add other text props
    const textProps = ['label', 'title', 'alt', 'name', 'value'];
    for (const prop of textProps) {
      if (prop in props && typeof props[prop] === 'string') {
        content += ' ' + props[prop];
      }
    }
    
    return content;
  }
  
  if (Array.isArray(node)) {
    return node.map(nodeToSearchableString).join(' ');
  }
  
  return '';
}

/**
 * Render React nodes safely for logging purposes
 */
export function safelyRenderNode(node: React.ReactNode): string {
  try {
    return nodeToSearchableString(node);
  } catch (error) {
    console.error('Error rendering React node for logging:', error);
    return '[Unrenderable React Node]';
  }
}
