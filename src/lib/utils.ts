
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { slugify } from "@/shared/utils/slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { slugify };
