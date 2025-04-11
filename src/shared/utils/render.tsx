
import React from 'react';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

const logger = getLogger();

/**
 * Safely renders React children with error handling
 */
export function safeRender(component: React.ReactNode, fallback?: React.ReactNode) {
  try {
    return component;
  } catch (error) {
    logger.error('Failed to render component', {
      category: LogCategory.UI,
      details: { error }
    });
    return fallback || null;
  }
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
