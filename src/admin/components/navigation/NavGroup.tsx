
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NavGroupProps {
  title?: string;
  children: React.ReactNode;
  collapsed?: boolean;
  className?: string;
}

export function NavGroup({
  title,
  children,
  collapsed = false,
  className,
}: NavGroupProps) {
  return (
    <div className={cn("nav-group mb-4", className)}>
      {title && !collapsed && (
        <h3 className="text-xs font-medium uppercase text-[var(--impulse-text-secondary)] px-4 py-2">
          {title}
        </h3>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          className="nav-group-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
