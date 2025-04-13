import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip';

interface AdminTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export function AdminTooltip({
  content,
  children,
  side = "right",
  align = "center",
  sideOffset = 4,
}: AdminTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align} sideOffset={sideOffset}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
