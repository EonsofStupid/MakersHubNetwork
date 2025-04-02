
import React, { useEffect, useRef } from 'react';
import { LogCategory } from '../types';
import { loggerService } from '../service/logger.service';
import { createMeasurement } from './performance';

/**
 * Safely render a React node, converting non-renderable values to strings
 */
export function safelyRenderNode(node: React.ReactNode): React.ReactNode {
  if (node === null || node === undefined) {
    return '';
  }

  if (
    typeof node === 'string' || 
    typeof node === 'number' || 
    typeof node === 'boolean' ||
    React.isValidElement(node)
  ) {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(safelyRenderNode);
  }

  // Convert objects to string representation
  return String(node);
}

/**
 * Converts a React node to a searchable string
 */
export function nodeToSearchableString(node: React.ReactNode): string {
  if (node === null || node === undefined) {
    return '';
  }

  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(nodeToSearchableString).join(' ');
  }

  if (React.isValidElement(node)) {
    // Try to get component name
    const componentName = (node.type as any)?.displayName || 
                         (node.type as any)?.name || 
                         'Component';
    
    // Also process children if available
    const childrenString = node.props.children 
      ? nodeToSearchableString(node.props.children) 
      : '';
    
    return `${componentName} ${childrenString}`.trim();
  }

  // Handle objects that might have a toString method
  if (typeof node === 'object') {
    try {
      return String(node);
    } catch (e) {
      return '[Object]';
    }
  }

  return '';
}

/**
 * Hook for monitoring React component performance
 */
export function useComponentPerformance(componentName: string) {
  const { start, end, measure } = createMeasurement(componentName, LogCategory.PERFORMANCE);
  const mountTimeRef = useRef<number>(0);
  const renderCountRef = useRef<number>(0);
  
  // Track component mounting and updates
  useEffect(() => {
    if (renderCountRef.current === 0) {
      // First render (mount)
      mountTimeRef.current = performance.now();
      start('mount');
    } else {
      // Re-render
      start(`render-${renderCountRef.current}`);
    }
    
    renderCountRef.current += 1;
    
    return () => {
      if (renderCountRef.current === 1) {
        // Component is unmounting after first render
        end('mount', 'Component mount to unmount');
      } else {
        // End the render timer
        end(`render-${renderCountRef.current - 1}`, `Component render #${renderCountRef.current - 1}`);
      }
    };
  });
  
  // Measure time to first meaningful render
  const markMeaningfulRender = () => {
    if (mountTimeRef.current > 0) {
      const timeToMeaningful = performance.now() - mountTimeRef.current;
      end('mount', 'Time to meaningful render');
    }
  };
  
  // Wrapper for measuring specific operations
  const measureOperation = <T,>(
    operationName: string,
    fn: () => T,
    description?: string
  ): T => {
    return measure(`${componentName}:${operationName}`, fn, description) as any;
  };
  
  return {
    renderCount: renderCountRef.current,
    markMeaningfulRender,
    measureOperation
  };
}

/**
 * Hook for measuring user interaction timing
 */
export function useInteractionTiming(source: string) {
  return {
    measureInteraction: <T,>(
      name: string,
      fn: (...args: any[]) => T,
      category: LogCategory = LogCategory.UI
    ) => {
      return (...args: any[]): T => {
        const start = performance.now();
        try {
          const result = fn(...args);
          const duration = performance.now() - start;
          
          loggerService.performance(`Interaction: ${name}`, duration, {
            source,
            category,
            details: { interaction: name, args }
          });
          
          return result;
        } catch (error) {
          const duration = performance.now() - start;
          
          loggerService.error(`Interaction failed: ${name}`, {
            source,
            category,
            details: { interaction: name, duration, error, args }
          });
          
          throw error;
        }
      };
    }
  };
}
