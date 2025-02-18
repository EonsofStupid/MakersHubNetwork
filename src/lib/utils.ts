
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')    // Remove non-word chars
    .replace(/[\s_-]+/g, '-')    // Replace spaces and _ with -
    .replace(/^-+|-+$/g, '');    // Remove leading/trailing -
}
