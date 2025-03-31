
import React from 'react';
import { cn } from '@/lib/utils';

interface NavigationListProps {
  children: React.ReactNode;
  containerId?: string;
  expanded?: boolean;
  className?: string;
}

export function NavigationList({
  children,
  containerId = 'main-navigation',
  expanded = true,
  className
}: NavigationListProps) {
  return (
    <div 
      className={cn(
        "admin-navigation-list",
        expanded ? "expanded" : "collapsed",
        className
      )}
      data-container-id={containerId}
      id={containerId}
    >
      {children}
    </div>
  );
}
