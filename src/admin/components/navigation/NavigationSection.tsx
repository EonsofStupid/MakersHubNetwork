
import React from 'react';
import { cn } from '@/lib/utils';

interface NavigationSectionProps {
  children: React.ReactNode;
  title?: string;
  expanded?: boolean;
  className?: string;
}

export function NavigationSection({
  children,
  title,
  expanded = true,
  className
}: NavigationSectionProps) {
  return (
    <div className={cn("navigation-section", className)}>
      {title && expanded && (
        <h3 className="text-xs font-medium uppercase text-[var(--impulse-text-secondary)] px-4 py-2">
          {title}
        </h3>
      )}
      <div className="navigation-section-content">
        {children}
      </div>
    </div>
  );
}
