
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AdminTooltip } from '../ui/AdminTooltip';

interface NavigationItemProps {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  isActive?: boolean;
  onClick: () => void;
  tooltipContent?: string;
  showTooltip?: boolean;
  className?: string;
}

export function NavigationItem({
  id,
  icon: Icon,
  label,
  description,
  isActive = false,
  onClick,
  tooltipContent,
  showTooltip = false,
  className
}: NavigationItemProps) {
  const content = (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      data-active={isActive}
      data-id={id}
      className={cn(
        "nav-item relative flex items-center w-full px-4 py-2.5 rounded-md",
        "text-sm font-medium transition-all",
        isActive 
          ? "bg-[var(--impulse-primary)]/20 text-[var(--impulse-primary)]" 
          : "text-[var(--impulse-text-primary)] hover:bg-[var(--impulse-bg-hover)]",
        className
      )}
    >
      <div className="flex-shrink-0 mr-3 flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      
      {label && (
        <span className={cn(
          "transition-all",
          isActive ? "cyber-text" : "cyber-text-subtle"
        )}>
          {label}
        </span>
      )}
      
      {isActive && (
        <motion.div
          layoutId="nav-active-indicator"
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-[60%] rounded-r-md bg-[var(--impulse-primary)]"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
  
  if (showTooltip && tooltipContent) {
    return (
      <AdminTooltip content={tooltipContent} side="right">
        {content}
      </AdminTooltip>
    );
  }
  
  return content;
}
