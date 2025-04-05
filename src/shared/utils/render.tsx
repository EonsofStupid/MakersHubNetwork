
import React from 'react';

/**
 * Safely renders an unknown value as a React node
 */
export function renderUnknownAsNode(value: unknown): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-gray-500">null</span>;
  }

  if (React.isValidElement(value)) {
    return value;
  }

  if (typeof value === 'object') {
    try {
      return <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(value, null, 2)}</pre>;
    } catch (error) {
      return <span className="text-red-400">[Unstringifiable Object]</span>;
    }
  }

  if (typeof value === 'function') {
    try {
      return <span className="text-purple-400">{value.toString()}</span>;
    } catch (error) {
      return <span className="text-gray-400">[Function]</span>;
    }
  }

  // Simple value
  return String(value);
}

/**
 * Converts a React node to a searchable string representation
 */
export function nodeToSearchableString(node: React.ReactNode): string {
  if (node === null || node === undefined) {
    return '';
  }

  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
    return String(node);
  }

  if (React.isValidElement(node)) {
    // Extract text content from children
    const children = node.props.children;
    if (!children) {
      return '';
    }
    if (typeof children === 'string' || typeof children === 'number') {
      return String(children);
    }
    if (Array.isArray(children)) {
      return children
        .map((child) => nodeToSearchableString(child))
        .join(' ');
    }
    return nodeToSearchableString(children);
  }

  if (Array.isArray(node)) {
    return node.map(nodeToSearchableString).join(' ');
  }

  if (typeof node === 'object') {
    try {
      return JSON.stringify(node);
    } catch {
      return '';
    }
  }

  return '';
}
