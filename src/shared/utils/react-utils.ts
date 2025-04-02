
import { useEffect, useRef } from 'react';
import React from 'react';

/**
 * Hook to check if a component is mounted
 */
export function useIsMounted() {
  const isMounted = useRef(false);
  
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  return isMounted;
}

/**
 * Safely extract URL parameters with type safety
 */
export function getUrlParam<T extends string | number>(
  param: string, 
  defaultValue?: T
): T | undefined {
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(param);
  
  if (value === null) {
    return defaultValue;
  }
  
  // Try to convert to number if T is number
  if (typeof defaultValue === 'number') {
    const numValue = Number(value);
    return isNaN(numValue) ? defaultValue : numValue as T;
  }
  
  return value as T;
}

/**
 * Format a date string with options
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

/**
 * Safely renders a React node or converts primitive values to strings
 * @param value The value to render safely
 * @returns A renderable React node
 */
export function safelyRenderNode(value: unknown): React.ReactNode {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (React.isValidElement(value)) {
    return value;
  }
  
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (err) {
      return String(value);
    }
  }
  
  return String(value);
}

/**
 * Converts a React node or other value to a searchable string representation
 * @param value The value to convert to a searchable string
 * @returns A string representation for searching
 */
export function nodeToSearchableString(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (React.isValidElement(value)) {
    // For React elements, we try to extract text content
    try {
      // For simple elements with string children
      const props = value.props as any;
      if (typeof props.children === 'string') {
        return props.children;
      }
      
      // Try to stringify the props
      return JSON.stringify(props);
    } catch (err) {
      return '';
    }
  }
  
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (err) {
      return String(value);
    }
  }
  
  return String(value);
}
