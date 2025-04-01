
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardShortcutProps {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  onRemove?: (e: React.MouseEvent) => void;
  isEditMode?: boolean;
}

export function DashboardShortcut({
  id,
  icon: Icon,
  label,
  onClick,
  onRemove,
  isEditMode = false
}: DashboardShortcutProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "group relative flex flex-col items-center justify-center p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors duration-200 cursor-pointer bg-background/80 hover:bg-background",
        isEditMode && "border-dashed"
      )}
      onClick={onClick}
      data-id={id}
      draggable={isEditMode}
      data-draggable={isEditMode ? "true" : "false"}
    >
      {isEditMode && onRemove && (
        <button
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onRemove}
        >
          <X className="w-3 h-3" />
        </button>
      )}
      
      <div className="mb-2 text-primary">
        <Icon className="w-6 h-6" />
      </div>
      
      <div className="text-center text-sm font-medium line-clamp-2">
        {label}
      </div>
    </motion.div>
  );
}
