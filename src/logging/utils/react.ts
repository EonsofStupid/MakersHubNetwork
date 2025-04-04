
import { isRecord } from './type-guards';

/**
 * Safely render a React node to a string for logging
 * Handles rendering React components in a safe way
 */
export function safelyRenderNode(node: any): string {
  try {
    // If it's a simple value, just return it
    if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
      return String(node);
    }
    
    // If it's null or undefined
    if (node == null) {
      return '';
    }
    
    // If it's a React element
    if (isReactElement(node)) {
      return `<${getComponentName(node.type) || 'Component'} />`;
    }
    
    // If it's an array, join the safely rendered elements
    if (Array.isArray(node)) {
      return node.map(safelyRenderNode).join('');
    }
    
    // For other objects, convert to string
    if (isRecord(node)) {
      return '[Object]';
    }
    
    // For functions
    if (typeof node === 'function') {
      return '[Function]';
    }
    
    // Default fall through
    return String(node);
  } catch (error) {
    return '[Error rendering node]';
  }
}

/**
 * Check if value is a React element
 */
function isReactElement(value: any): boolean {
  return isRecord(value) && 
    '$$typeof' in value && 
    value.$$typeof === Symbol.for('react.element');
}

/**
 * Get component name from a React component type
 */
function getComponentName(type: any): string {
  // Function component or class component
  if (typeof type === 'function') {
    return type.displayName || type.name || 'Unknown';
  }
  
  // Host component (string) or fragment
  if (typeof type === 'string') {
    return type;
  }
  
  // For other types (e.g., context, provider, etc.)
  if (isRecord(type)) {
    return type.displayName || 'Object';
  }
  
  return 'Unknown';
}
