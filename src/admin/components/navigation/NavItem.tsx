
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { useDragAndDrop } from '@/admin/hooks/useDragAndDrop';
import { AdminTooltip } from '@/admin/components/ui/AdminTooltip';
import { GripVertical } from 'lucide-react';

interface NavItemProps {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  onClick?: () => void;
  showLabel?: boolean;
  draggable?: boolean;
  className?: string;
}

export function NavItem({
  id,
  label,
  path,
  icon: Icon,
  isActive = false,
  onClick,
  showLabel = true,
  draggable = false,
  className,
}: NavItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isEditMode] = useAtom(adminEditModeAtom);
  
  // Set up drag and drop
  const { makeDraggable } = useDragAndDrop({
    items: [id],
    containerId: 'navigation-items',
    dragOnlyInEditMode: true,
  });
  
  // Make item draggable if in edit mode and draggable prop is true
  useEffect(() => {
    if (itemRef.current && draggable && isEditMode) {
      return makeDraggable(itemRef.current, id);
    }
  }, [id, makeDraggable, isEditMode, draggable]);
  
  const content = (
    <motion.div
      ref={itemRef}
      data-id={id}
      data-path={path}
      whileHover={{ x: isActive ? 0 : 5 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "nav-item flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors relative",
        isActive 
          ? "bg-[var(--impulse-bg-hover)] text-[var(--impulse-primary)]" 
          : "text-[var(--impulse-text-primary)] hover:bg-[var(--impulse-bg-hover)]",
        isEditMode && draggable && "draggable opacity-90 hover:opacity-100",
        !showLabel && "justify-center",
        className
      )}
    >
      {isEditMode && draggable && (
        <span className="drag-handle mr-1 cursor-grab">
          <GripVertical className="w-3 h-3 text-[var(--impulse-text-secondary)]" />
        </span>
      )}
      
      <div className={cn("icon-wrapper flex-shrink-0", showLabel ? "mr-3" : "")}>
        <Icon className="w-5 h-5" />
      </div>
      
      {showLabel && (
        <span className="nav-item-label truncate">{label}</span>
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
  
  // Show tooltip if labels are hidden
  if (!showLabel) {
    return (
      <AdminTooltip content={label} side="right">
        {content}
      </AdminTooltip>
    );
  }
  
  return content;
}
