
import { cn } from '@/lib/utils';

// Common scrollbar styling 
export const scrollbarStyle = cn(
  "scrollbar-thin",
  "scrollbar-thumb-[var(--impulse-border-normal)]",
  "scrollbar-track-transparent",
  "hover:scrollbar-thumb-[var(--impulse-border-hover)]"
);

// Electric effect styles for elements
export const electricBorderStyle = cn(
  "border border-[var(--impulse-border-normal)]",
  "relative overflow-hidden",
  "before:content-[''] before:absolute before:inset-0",
  "before:bg-gradient-to-r before:from-[var(--impulse-primary)/0] before:via-[var(--impulse-primary)/30] before:to-[var(--impulse-primary)/0]",
  "before:animate-pulse before:opacity-0 hover:before:opacity-100"
);

// Glassmorphism effect
export const glassmorphismStyle = cn(
  "bg-[var(--impulse-bg-overlay)]",
  "backdrop-blur-md",
  "border border-[var(--impulse-border-normal)]"
);

// Cyber text effect
export const cyberTextStyle = cn(
  "text-[var(--impulse-text-primary)]",
  "tracking-wide",
  "font-medium",
  "relative"
);
