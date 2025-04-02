
import React, { isValidElement, Fragment, ReactNode } from 'react';

/**
 * Type guard for renderable React nodes
 */
export function isReactRenderable(value: unknown): value is ReactNode {
  return (
    value == null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    isValidElement(value) ||
    (Array.isArray(value) && value.every(isReactRenderable))
  );
}

/**
 * Safely renders unknown values into ReactNode
 */
export function safelyRenderNode(value: unknown): ReactNode {
  if (isReactRenderable(value)) return value;

  if (typeof value === 'object') {
    try {
      const stringified = JSON.stringify(value, null, 2);
      return React.createElement(Fragment, null, stringified);
    } catch {
      return React.createElement(Fragment, null, '[Unrenderable Object]');
    }
  }

  return React.createElement(Fragment, null, String(value));
}

/**
 * @deprecated Use isReactRenderable instead for more accurate type checking
 */
export function isReactNode(value: unknown): value is React.ReactNode {
  return (
    value === undefined ||
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    React.isValidElement(value) ||
    Array.isArray(value)
  );
}
