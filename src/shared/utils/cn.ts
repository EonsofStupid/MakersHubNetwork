
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * and handle conditional classes correctly
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
