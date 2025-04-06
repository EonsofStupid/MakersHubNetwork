
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AdminTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  className?: string;
}

// Create a shared tooltip provider to avoid nesting providers
export const AdminTooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <TooltipProvider delayDuration={300}>{children}</TooltipProvider>;
};

export function AdminTooltip({
  children,
  content,
  side = 'top',
  align = 'center',
  className,
}: AdminTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="cursor-pointer">
          {children}
        </div>
      </TooltipTrigger>
      <TooltipContent 
        side={side} 
        align={align}
        className={`cyber-tooltip ${className || ''}`}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
