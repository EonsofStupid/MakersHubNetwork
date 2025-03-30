
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NavigationSectionProps {
  children: ReactNode;
  title?: string;
  className?: string;
  expanded?: boolean;
}

export function NavigationSection({ 
  children, 
  title, 
  className,
  expanded = true 
}: NavigationSectionProps) {
  return (
    <div className={cn("admin-navigation-section py-2", className)}>
      {title && expanded && (
        <motion.h3
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="px-4 text-xs uppercase text-[var(--impulse-text-secondary)] font-medium tracking-wider mb-2"
        >
          {title}
        </motion.h3>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}
