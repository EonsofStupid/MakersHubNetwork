
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date object or string into a locale date string
 */
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Truncates a string to a maximum length and adds an ellipsis
 */
export function truncate(str: string, length: number): string {
  if (!str) return '';
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

/**
 * Debounce function for limiting the rate at which a function can fire
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generates a random string to use as an ID
 */
export function generateId(length = 8): string {
  return Math.random().toString(36).substring(2, length + 2);
}
