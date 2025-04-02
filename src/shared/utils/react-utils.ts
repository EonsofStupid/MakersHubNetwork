
import { useEffect, useRef } from 'react';

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
