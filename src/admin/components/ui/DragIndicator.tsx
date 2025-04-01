
import React from 'react';
import { useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import { adminDraggedItemAtom, adminDropTargetAtom } from '@/admin/atoms/tools.atoms';

export function DragIndicator() {
  const [draggedItem] = useAtom(adminDraggedItemAtom);
  const [dropTarget] = useAtom(adminDropTargetAtom);
  
  // Only show when dragging
  if (!draggedItem) return null;
  
  return (
    <AnimatePresence>
      {draggedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-2 right-2 z-50 bg-black/80 text-white text-sm py-1 px-3 rounded-full border border-[var(--impulse-border-normal)]"
        >
          <span>Dragging: {draggedItem.id}</span>
          {dropTarget && (
            <span className="ml-2">Target: {dropTarget.id}</span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

