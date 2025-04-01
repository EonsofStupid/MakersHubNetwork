
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDragAndDrop } from '@/admin/hooks/useDragAndDrop';
import { AdminTooltip } from '@/admin/components/ui/AdminTooltip';
import { LucideIcon } from 'lucide-react';

interface DashboardShortcutProps {
  id: string;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  onRemove?: (e: React.MouseEvent) => void;
  isEditMode?: boolean;
  className?: string;
}

export function DashboardShortcut({
  id,
  icon: Icon,
  label,
  onClick,
  onRemove,
  isEditMode = false,
  className,
}: DashboardShortcutProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  
  // Set up drag and drop
  const { makeDraggable } = useDragAndDrop({
    items: [id],
    containerId: 'dashboard-shortcuts',
    dragOnlyInEditMode: true,
  });
  
  // Make item draggable if in edit mode
  useEffect(() => {
    if (itemRef.current && isEditMode) {
      return makeDraggable(itemRef.current, id);
    }
  }, [id, makeDraggable, isEditMode]);
  
  return (
    <motion.div
      ref={itemRef}
      data-id={id}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "dashboard-shortcut relative flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-card hover:bg-card/80 border border-border transition-all cursor-pointer",
        isEditMode && "draggable border-dashed border-primary/40",
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      
      <span className="text-sm font-medium text-primary-foreground">{label}</span>
      
      {isEditMode && onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center shadow-md hover:scale-110 transition-transform"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </motion.div>
  );
}
