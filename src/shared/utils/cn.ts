
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for conditionally joining class names with Tailwind support
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
