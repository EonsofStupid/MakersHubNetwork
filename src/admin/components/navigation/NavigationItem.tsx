
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AdminTooltip } from '../ui/AdminTooltip';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { useDragAndDrop } from '@/admin/hooks/useDragAndDrop';

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
  const itemRef = useRef<HTMLDivElement>(null);
  const [isEditMode] = useAtom(adminEditModeAtom);
  
  // Use the drag and drop hook
  const { makeDraggable } = useDragAndDrop({
    items: [id],
    containerId: 'main-navigation',
    dragOnlyInEditMode: true
  });
  
  // Make the item draggable in edit mode
  useEffect(() => {
    if (itemRef.current) {
      return makeDraggable(itemRef.current, id);
    }
  }, [id, isEditMode, makeDraggable]);
  
  const content = (
    <motion.div
      ref={itemRef}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      data-active={isActive}
      data-id={id}
      className={cn(
        "nav-item relative flex items-center w-full px-4 py-2.5 rounded-md",
        "text-sm font-medium transition-all",
        isActive 
          ? "bg-[var(--impulse-primary)]/20 text-[var(--impulse-primary)]" 
          : "text-[var(--impulse-text-primary)] hover:bg-[var(--impulse-bg-hover)]",
        isEditMode && "draggable cursor-grab active:cursor-grabbing",
        className
      )}
    >
      <div className="flex-shrink-0 mr-3 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[var(--impulse-primary)]/10 rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
      
      {isEditMode && (
        <div className="absolute inset-0 border border-dashed border-[var(--impulse-primary)]/50 rounded-md pointer-events-none" />
      )}
    </motion.div>
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
