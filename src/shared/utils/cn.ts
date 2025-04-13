
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to concatenate class names
 * Combines clsx and tailwind-merge for efficient class name handling
 * @param inputs - Class names to concatenate
 * @returns Merged class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
