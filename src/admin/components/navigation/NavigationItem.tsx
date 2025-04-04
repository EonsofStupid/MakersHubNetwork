
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { useDragDrop } from '@/admin/hooks/useDragDrop';
import { AdminTooltip } from '@/admin/components/ui/AdminTooltip';
import { GripVertical } from 'lucide-react';

interface NavigationItemProps {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  onClick?: () => void;
  tooltipContent?: string;
  showTooltip?: boolean;
  className?: string;
}

export function NavigationItem({
  id,
  label,
  description,
  icon: Icon,
  isActive = false,
  onClick,
  tooltipContent,
  showTooltip = false,
  className,
}: NavigationItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isEditMode] = useAtom(adminEditModeAtom);
  
  // Set up drag and drop
  const { makeDraggable } = useDragDrop({
    containerId: 'navigation-items',
    itemId: id,
    dragOnlyInEditMode: true
  });
  
  // Make item draggable if in edit mode
  useEffect(() => {
    if (itemRef.current) {
      const cleanup = makeDraggable(itemRef.current);
      return cleanup;
    }
  }, [id, makeDraggable, isEditMode]);
  
  const content = (
    <motion.div
      ref={itemRef}
      data-id={id}
      whileHover={{ x: isActive ? 0 : 5 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "nav-item",
        isActive && "active",
        isEditMode && "draggable",
        className
      )}
    >
      {isEditMode && (
        <span className="nav-item__drag-handle mr-1">
          <GripVertical className="w-3 h-3 text-[var(--impulse-text-secondary)]" />
        </span>
      )}
      
      <div className="nav-item__icon">
        <Icon className="w-5 h-5" />
        <div className="nav-item__icon-glow" />
      </div>
      
      {label && (
        <span className="nav-item__label">{label}</span>
      )}
      
      {isActive && (
        <motion.div
          layoutId="nav-active-indicator"
          className="absolute inset-y-0 left-0 w-1 bg-[var(--impulse-primary)] rounded-r"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
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
