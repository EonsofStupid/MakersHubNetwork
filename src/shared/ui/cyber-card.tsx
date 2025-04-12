
import React, { ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

export interface CyberCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function CyberCard({ children, className, title }: CyberCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-lg border border-primary/20 bg-background/60 backdrop-blur-md p-4 transition-all duration-300',
        'hover:border-primary/40 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]',
        className
      )}
    >
      {title && (
        <h3 className="text-xl font-bold mb-3">{title}</h3>
      )}
      {children}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-0 left-0 w-2 h-2 bg-primary/30 rounded-full"></span>
        <span className="absolute top-0 right-0 w-2 h-2 bg-primary/30 rounded-full"></span>
        <span className="absolute bottom-0 left-0 w-2 h-2 bg-primary/30 rounded-full"></span>
        <span className="absolute bottom-0 right-0 w-2 h-2 bg-primary/30 rounded-full"></span>
      </div>
    </div>
  );
}
