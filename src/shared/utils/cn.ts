
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines and merges class names with Tailwind CSS
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
