
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminTooltip } from '@/admin/components/ui/AdminTooltip';
import { useDragAndDrop } from '@/admin/hooks/useDragAndDrop';

interface DashboardShortcutProps {
  id: string;
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  onRemove?: (e: React.MouseEvent) => void;
  isEditMode?: boolean;
  className?: string;
}

export function DashboardShortcut({
  id,
  title,
  description,
  icon: Icon,
  onClick,
  onRemove,
  isEditMode = false,
  className
}: DashboardShortcutProps) {
  const shortcutRef = useRef<HTMLDivElement>(null);
  
  // Make the shortcut draggable in edit mode
  const { makeDraggable } = useDragAndDrop({
    items: [id],
    containerId: 'dashboard-shortcuts',
    dragOnlyInEditMode: true
  });
  
  // Register drag functionality in edit mode
  useEffect(() => {
    if (shortcutRef.current && isEditMode) {
      return makeDraggable(shortcutRef.current, id);
    }
  }, [id, isEditMode, makeDraggable]);
  
  return (
    <motion.div
      ref={shortcutRef}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={isEditMode ? undefined : onClick}
      data-id={id}
      className={cn(
        "group relative flex flex-col items-center justify-center p-4 rounded-lg transition-all",
        "bg-[var(--impulse-bg-card)] border border-[var(--impulse-border-normal)]",
        "hover:border-[var(--impulse-border-hover)] hover:bg-[var(--impulse-bg-hover)]",
        isEditMode && "cursor-grab active:cursor-grabbing electric-border",
        "min-h-[140px]",
        className
      )}
    >
      {/* Icon with glow */}
      <div className="flex items-center justify-center w-10 h-10 mb-3 relative">
        <div className="absolute inset-0 bg-[var(--impulse-primary)]/10 rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <Icon className="w-6 h-6 text-[var(--impulse-text-primary)] group-hover:text-[var(--impulse-primary)] transition-colors" />
      </div>
      
      {/* Title */}
      <h3 className="text-sm font-medium text-[var(--impulse-text-primary)] text-center group-hover:text-[var(--impulse-primary)] transition-colors">
        {title}
      </h3>
      
      {/* Description */}
      {description && (
        <p className="mt-1 text-xs text-[var(--impulse-text-secondary)] text-center">
          {description}
        </p>
      )}
      
      {/* Remove button in edit mode */}
      {isEditMode && onRemove && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white z-10"
        >
          <X className="w-3 h-3" />
        </motion.button>
      )}
      
      {/* Edit mode indicator */}
      {isEditMode && (
        <motion.div 
          className="absolute inset-0 border border-dashed border-[var(--impulse-primary)]/50 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      
      {/* Electric effects */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={isEditMode ? {
          boxShadow: [
            "0 0 0 0 rgba(0, 240, 255, 0)",
            "0 0 10px rgba(0, 240, 255, 0.2)",
            "0 0 0 0 rgba(0, 240, 255, 0)"
          ]
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "loop"
        }}
      />
    </motion.div>
  );
}
