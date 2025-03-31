
import { cn } from "@/lib/utils";

// Reusable scrollbar style for admin components
export const scrollbarStyle = cn(
  "scrollbar-thin",
  "scrollbar-track-transparent",
  "scrollbar-thumb-[var(--impulse-border-hover)]",
  "hover:scrollbar-thumb-[var(--impulse-border-active)]"
);

// Common card styles
export const cardStyle = cn(
  "bg-[var(--impulse-bg-card)]",
  "border border-[var(--impulse-border-normal)]",
  "hover:border-[var(--impulse-border-hover)]",
  "rounded-md shadow-sm"
);

// Cyber effect style
export const cyberEffect = cn(
  "relative",
  "after:content-['']",
  "after:absolute after:inset-0",
  "after:border after:border-[var(--impulse-primary)]/30",
  "after:shadow-[0_0_10px_var(--impulse-primary)]",
  "after:opacity-0 after:transition-opacity",
  "hover:after:opacity-100"
);

// Electric border style
export const electricBorder = cn(
  "border-[var(--impulse-border-normal)]",
  "hover:border-[var(--impulse-primary)]",
  "transition-colors"
);

// Admin heading styles
export const headingStyle = cn(
  "text-xl font-bold",
  "text-[var(--impulse-text-primary)]",
  "mb-4"
);

// Admin subheading style
export const subheadingStyle = cn(
  "text-sm font-medium",
  "text-[var(--impulse-text-secondary)]",
  "mb-2"
);
