
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AdminTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  className?: string;
}

export function AdminTooltip({
  children,
  content,
  side = "top",
  align = "center",
  sideOffset = 4,
  className
}: AdminTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          align={align} 
          sideOffset={sideOffset}
          className={`bg-[var(--impulse-bg-overlay)] backdrop-blur-lg border border-[var(--impulse-border-normal)] text-[var(--impulse-text-primary)] text-xs px-2.5 py-1.5 ${className || ''}`}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
