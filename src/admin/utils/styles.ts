
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

// Grid layout style
export const adminGrid = cn(
  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
);

// Admin button styles
export const adminButtonPrimary = cn(
  "bg-[var(--impulse-primary)] text-[var(--impulse-bg-main)]",
  "hover:bg-[var(--impulse-primary)]/90",
  "rounded-md px-4 py-2",
  "transition-all duration-200"
);

export const adminButtonSecondary = cn(
  "bg-[var(--impulse-bg-card)] text-[var(--impulse-text-primary)]",
  "border border-[var(--impulse-border-normal)]",
  "hover:border-[var(--impulse-primary)] hover:bg-[var(--impulse-primary)]/10",
  "rounded-md px-4 py-2",
  "transition-all duration-200"
);

export const adminButtonOutline = cn(
  "bg-transparent",
  "border border-[var(--impulse-border-normal)]",
  "text-[var(--impulse-text-primary)]",
  "hover:border-[var(--impulse-primary)] hover:text-[var(--impulse-primary)]",
  "rounded-md px-4 py-2",
  "transition-all duration-200"
);

// Admin glassmorphism effect
export const glassMorphism = cn(
  "bg-[var(--impulse-bg-overlay)]",
  "backdrop-blur-lg",
  "border border-[var(--impulse-border-normal)]",
  "hover:border-[var(--impulse-border-hover)]"
);

// Admin section wrapper
export const sectionWrapper = cn(
  "p-6 rounded-lg",
  "bg-[var(--impulse-bg-card)]",
  "border border-[var(--impulse-border-normal)]",
  "mb-6"
);

// Admin panel container
export const panelContainer = cn(
  "flex flex-col",
  "h-full w-full",
  "overflow-hidden"
);
