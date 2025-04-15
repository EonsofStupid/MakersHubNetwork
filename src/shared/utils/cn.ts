
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines Tailwind CSS classes with clsx and tailwind-merge
 * @param inputs - The classes to combine
 * @returns The combined and deduplicated classes
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
