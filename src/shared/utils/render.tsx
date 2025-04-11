
import React from 'react';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

const logger = getLogger();

/**
 * Convert an error object to a plain object for logging
 */
export function errorToObject(error: unknown): Record<string, any> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause ? errorToObject(error.cause) : undefined
    };
  }
  
  if (typeof error === 'string') {
    return { message: error };
  }
  
  if (error && typeof error === 'object') {
    return { ...error };
  }
  
  return { unknown: String(error) };
}

/**
 * Safely renders React children with error handling
 */
export function safeRender(component: React.ReactNode, fallback?: React.ReactNode) {
  try {
    return component;
  } catch (error) {
    logger.error('Failed to render component', {
      category: LogCategory.UI,
      details: { error: errorToObject(error) }
    });
    return fallback || null;
  }
}

/**
 * Renders unknown data as a React node safely
 */
export function renderUnknownAsNode(value: unknown): React.ReactNode {
  if (value === null || value === undefined) {
    return null;
  }
  
  if (React.isValidElement(value)) {
    return value;
  }
  
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value.toString();
  }
  
  if (Array.isArray(value)) {
    return value.map((item, index) => (
      <React.Fragment key={index}>
        {renderUnknownAsNode(item)}
      </React.Fragment>
    ));
  }
  
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (error) {
      return '[Object]';
    }
  }
  
  return String(value);
}

/**
 * Convert a React node to a searchable string
 */
export function nodeToSearchableString(node: React.ReactNode): string {
  if (node === null || node === undefined) {
    return '';
  }
  
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
    return node.toString();
  }
  
  if (React.isValidElement(node)) {
    const children = node.props.children;
    if (children) {
      return nodeToSearchableString(children);
    }
    return '';
  }
  
  if (Array.isArray(node)) {
    return node.map(nodeToSearchableString).join(' ');
  }
  
  if (typeof node === 'object') {
    try {
      return JSON.stringify(node);
    } catch (error) {
      return '';
    }
  }
  
  return String(node);
}

/**
 * Conditionally renders a component if the condition is true
 */
export function renderIf(
  condition: boolean, 
  component: React.ReactNode, 
  fallback?: React.ReactNode
) {
  if (condition) {
    return component;
  }
  
  return fallback || null;
}

/**
 * Renders the first truthy component from a list of components
 */
export function renderFirst(components: React.ReactNode[]) {
  for (const component of components) {
    if (component) {
      return component;
    }
  }
  
  return null;
}

/**
 * Renders a component with a loading state
 */
export function renderWithLoading(
  isLoading: boolean,
  component: React.ReactNode,
  loadingComponent: React.ReactNode
) {
  if (isLoading) {
    return loadingComponent;
  }
  
  return component;
}

/**
 * Renders a numbered list of components
 */
export function renderNumbered(components: React.ReactNode[], 
  prefix: string = '', 
  className: string = ''
) {
  return components.map((component, index) => (
    <div key={index} className={className}>
      <span>{prefix}{index + 1}. </span>
      {component}
    </div>
  ));
}
