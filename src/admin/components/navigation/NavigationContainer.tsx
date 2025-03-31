
import React from 'react';
import { cn } from '@/lib/utils';

interface NavigationContainerProps {
  children: React.ReactNode;
  expanded?: boolean;
  className?: string;
}

export function NavigationContainer({
  children,
  expanded = true,
  className
}: NavigationContainerProps) {
  return (
    <div className={cn(
      "admin-navigation-container",
      expanded ? "expanded" : "collapsed",
      className
    )}>
      {children}
    </div>
  );
}
