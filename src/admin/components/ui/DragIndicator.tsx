
import React from 'react';
import { motion } from 'framer-motion';
import { useAdminStore } from '@/admin/store/admin.store';
import { cn } from '@/lib/utils';

export function DragIndicator() {
  const { dragSource, dragTarget } = useAdminStore();
  
  if (!dragSource) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
    >
      <div className={cn(
        "px-4 py-2 rounded-full backdrop-blur-md border",
        "bg-[var(--impulse-bg-overlay)] text-[var(--impulse-text-primary)]",
        "border-[var(--impulse-border-normal)] shadow-md",
        "flex items-center gap-2"
      )}>
        <span className="animate-pulse">⟠</span>
        <span className="text-sm">
          {dragTarget ? 'Drop to add to ' + dragTarget : 'Drag to add to dashboard or quick menu'}
        </span>
      </div>
    </motion.div>
  );
}
