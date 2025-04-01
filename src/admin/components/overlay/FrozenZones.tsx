
import React from 'react';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Component to display overlay zones that are "frozen" or inactive
 * during admin edit mode
 */
export function FrozenZones() {
  const [isEditMode] = useAtom(adminEditModeAtom);

  if (!isEditMode) return null;

  return (
    <AnimatePresence>
      {isEditMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-40"
        >
          <div className="absolute top-0 left-0 right-0 h-16 bg-blue-500/10 border-b border-blue-500/30" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-blue-500/10 border-t border-blue-500/30" />
          <div className="absolute top-16 bottom-16 left-0 w-64 bg-blue-500/10 border-r border-blue-500/30" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
