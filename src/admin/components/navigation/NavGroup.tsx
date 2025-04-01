
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NavGroupProps {
  children: React.ReactNode;
  title: string;
  collapsed?: boolean;
}

export function NavGroup({ children, title, collapsed = false }: NavGroupProps) {
  return (
    <div className="mb-4">
      {!collapsed && (
        <h3 className={cn(
          "text-xs uppercase text-[var(--impulse-text-secondary)] mb-2 px-3",
          "transition-opacity duration-300",
          collapsed ? "opacity-0" : "opacity-100"
        )}>
          {title}
        </h3>
      )}
      <motion.ul
        initial={false}
        className="flex flex-col space-y-1"
      >
        {children}
      </motion.ul>
    </div>
  );
}
