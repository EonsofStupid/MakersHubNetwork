
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDragDrop } from '@/admin/hooks/useDragDrop';
import { AdminTooltip } from '@/admin/components/ui/AdminTooltip';
import { LucideIcon } from 'lucide-react';

interface TopNavItemProps {
  id: string;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  onRemove?: (e: React.MouseEvent) => void;
  isEditMode?: boolean;
  className?: string;
}

export function TopNavItem({
  id,
  icon: Icon,
  label,
  onClick,
  onRemove,
  isEditMode = false,
  className,
}: TopNavItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  
  // Set up drag and drop
  const { makeDraggable } = useDragDrop({
    containerId: 'top-nav-items',
    itemId: id,
    dragOnlyInEditMode: true
  });
  
  // Make item draggable if in edit mode
  useEffect(() => {
    if (itemRef.current && isEditMode) {
      const cleanup = makeDraggable(itemRef.current);
      return cleanup;
    }
  }, [id, makeDraggable, isEditMode]);
  
  return (
    <AdminTooltip content={label}>
      <motion.div
        ref={itemRef}
        data-id={id}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className={cn(
          "relative admin-topnav-item",
          isEditMode && "draggable",
          className
        )}
      >
        <Icon className="w-4 h-4 text-[var(--impulse-text-primary)]" />
        
        {isEditMode && onRemove && (
          <button
            onClick={onRemove}
            className="absolute -top-1.5 -right-1.5 bg-[var(--impulse-primary)] text-white rounded-full w-4 h-4 flex items-center justify-center"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </motion.div>
    </AdminTooltip>
  );
}
