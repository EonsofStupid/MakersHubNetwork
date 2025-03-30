
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminStore } from '@/admin/store/admin.store';
import { cn } from '@/lib/utils';
import { adminNavigationItems } from '@/admin/config/navigation.config';

export function DragIndicator() {
  const { dragSource, dragTarget } = useAdminStore();
  
  if (!dragSource) return null;
  
  const sourceItem = adminNavigationItems.find(item => item.id === dragSource);
  const sourceName = sourceItem ? sourceItem.label : 'Item';
  
  let targetName = '';
  switch (dragTarget) {
    case 'topnav':
      targetName = 'top navigation';
      break;
    case 'dashboard':
      targetName = 'dashboard shortcuts';
      break;
    default:
      targetName = '';
  }
  
  return (
    <AnimatePresence>
      {dragSource && (
        <motion.div
          key="drag-indicator"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
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
              {targetName 
                ? `Drop "${sourceName}" to add to ${targetName}` 
                : `Drag "${sourceName}" to add to dashboard or top navigation`}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
