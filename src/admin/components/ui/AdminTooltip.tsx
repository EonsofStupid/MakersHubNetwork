
import React from 'react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AdminTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delay?: number;
  className?: string;
  contentClassName?: string;
}

export function AdminTooltip({
  children,
  content,
  side = "right",
  align = "center",
  delay = 300,
  className,
  contentClassName
}: AdminTooltipProps) {
  const tooltipAnimation = {
    initial: { opacity: 0, scale: 0.85 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.85 },
    transition: { duration: 0.2 }
  };

  return (
    <TooltipProvider delayDuration={delay}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={className}>
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          align={align}
          className={cn(
            "admin-tooltip",
            "border-[var(--impulse-border-normal)] bg-[var(--impulse-bg-overlay)]",
            "px-3 py-1.5 text-sm backdrop-blur-md z-50",
            contentClassName
          )}
          sideOffset={5}
        >
          <motion.div
            initial={tooltipAnimation.initial}
            animate={tooltipAnimation.animate}
            exit={tooltipAnimation.exit}
            transition={tooltipAnimation.transition}
          >
            {content}
          </motion.div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
