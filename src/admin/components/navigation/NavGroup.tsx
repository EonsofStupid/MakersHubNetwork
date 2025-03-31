
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavGroupProps {
  title: string;
  children: React.ReactNode;
  collapsed?: boolean;
  defaultOpen?: boolean;
  className?: string;
}

export function NavGroup({
  title,
  children,
  collapsed = false,
  defaultOpen = true,
  className
}: NavGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  // Don't allow toggling if in collapsed sidebar mode
  const handleToggle = () => {
    if (!collapsed) {
      setIsOpen(!isOpen);
    }
  };
  
  return (
    <div className={cn("nav-group mb-4", className)}>
      {!collapsed && (
        <button 
          className="nav-group-header flex items-center justify-between w-full text-xs font-medium uppercase text-[var(--impulse-text-secondary)] px-3 py-2 hover:text-[var(--impulse-text-primary)]"
          onClick={handleToggle}
        >
          <span>{title}</span>
          {isOpen ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
        </button>
      )}
      
      <AnimatePresence>
        {(isOpen || collapsed) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="nav-group-content"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
