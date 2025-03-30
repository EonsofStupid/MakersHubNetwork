
import { cn } from "@/lib/utils";

/**
 * Common styling utilities for the admin interface
 */

// Consistent scrollbar styling
export const scrollbarStyle = cn(
  "scrollbar-thin scrollbar-thumb-[var(--impulse-border-normal)] scrollbar-track-transparent",
  "hover:scrollbar-thumb-[var(--impulse-border-hover)]",
  "overflow-y-auto overflow-x-hidden"
);

// Glass panel styling
export const glassPanelStyle = cn(
  "bg-[var(--impulse-bg-card)] backdrop-blur-md",
  "border border-[var(--impulse-border-normal)]",
  "hover:border-[var(--impulse-border-hover)]",
  "rounded-xl",
  "transition-all duration-300"
);

// Card styling
export const cardStyle = cn(
  "bg-[var(--impulse-bg-card)]",
  "border border-[var(--impulse-border-normal)]",
  "rounded-xl overflow-hidden",
  "transition-all duration-300"
);

// Button styling
export const buttonStyle = cn(
  "bg-[var(--impulse-bg-card)]",
  "border border-[var(--impulse-border-normal)]",
  "hover:border-[var(--impulse-border-hover)]",
  "hover:bg-[var(--impulse-primary)]/10",
  "rounded-lg px-4 py-2",
  "transition-all duration-200",
  "focus:outline-none focus:ring-2 focus:ring-[var(--impulse-primary)]/50"
);

// Active item styling
export const activeItemStyle = cn(
  "bg-[var(--impulse-primary)]/10",
  "border-[var(--impulse-primary)]",
  "text-[var(--impulse-primary)]"
);

// A muted, subtle style for secondary items
export const mutedItemStyle = cn(
  "bg-[var(--impulse-bg-main)]",
  "border-[var(--impulse-border-normal)]",
  "text-[var(--impulse-text-secondary)]",
  "hover:text-[var(--impulse-text-primary)]"
);

// Cyberpunk style for cards with angle cuts
export const cyberCardStyle = (colorIndex: number = 0) => {
  const colors = [
    "from-blue-500/10 to-purple-500/5", // Blue-Purple
    "from-purple-500/10 to-pink-500/5", // Purple-Pink
    "from-cyan-500/10 to-blue-500/5",   // Cyan-Blue
    "from-green-500/10 to-cyan-500/5"   // Green-Cyan
  ];
  
  return cn(
    glassPanelStyle,
    "relative overflow-hidden",
    "after:content-[''] after:absolute after:inset-0",
    `after:bg-gradient-to-br ${colors[colorIndex % colors.length]}`,
    "after:pointer-events-none after:z-[-1]"
  );
};

// Admin sidebar item styling
export const sidebarItemStyle = cn(
  "flex items-center gap-3 px-4 py-2.5",
  "rounded-lg",
  "text-[var(--impulse-text-secondary)]",
  "hover:text-[var(--impulse-text-primary)]",
  "hover:bg-[var(--impulse-border-hover)]/10",
  "transition-all duration-200",
  "cursor-pointer"
);

// Admin sidebar active item styling
export const sidebarActiveItemStyle = cn(
  sidebarItemStyle,
  "bg-[var(--impulse-primary)]/10",
  "text-[var(--impulse-primary)]",
  "border-l-2 border-[var(--impulse-primary)]",
  "pl-[calc(1rem-2px)]"
);

// Admin tooltip styling
export const tooltipStyle = cn(
  "bg-[var(--impulse-bg-card)] backdrop-blur-md",
  "border border-[var(--impulse-border-normal)]",
  "rounded-md px-3 py-1.5",
  "text-xs text-[var(--impulse-text-primary)]",
  "shadow-lg z-50",
  "max-w-xs"
);
