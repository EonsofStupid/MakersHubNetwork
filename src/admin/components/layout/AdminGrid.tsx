
import React from 'react';
import { cn } from '@/lib/utils';

interface AdminGridProps {
  children?: React.ReactNode;
  className?: string;
  cols?: number;
  gap?: number;
}

export function AdminGrid({ 
  children, 
  className = '', 
  cols = 1,
  gap = 6
}: AdminGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[cols] || 'grid-cols-1';
  
  const gridGap = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
  }[gap] || 'gap-4';
  
  return (
    <div className={cn("grid", gridCols, gridGap, className)}>
      {children}
    </div>
  );
}
