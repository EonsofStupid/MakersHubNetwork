import React from 'react';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function FrozenZones() {
  const [isEditMode] = useAtom(adminEditModeAtom);
  
  // Only show in edit mode
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
          {/* Top navigation area */}
          <div className={cn(
            "absolute top-0 left-0 right-0 h-14 border-b border-dashed",
            "border-[var(--impulse-primary)]/30 bg-[var(--impulse-primary)]/5"
          )}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-[var(--impulse-primary)]/20 text-[var(--impulse-primary)] text-xs px-2 py-0.5 rounded-t-md">
              Top Navigation (Fixed)
            </div>
          </div>
          
          {/* Sidebar area */}
          <div className={cn(
            "absolute top-14 left-0 bottom-0 w-[240px] border-r border-dashed",
            "border-[var(--impulse-primary)]/30 bg-[var(--impulse-primary)]/5"
          )}>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[var(--impulse-primary)]/20 text-[var(--impulse-primary)] text-xs px-2 py-0.5 rounded-md">
              Sidebar (Fixed)
            </div>
          </div>
          
          {/* Footer area */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 h-10 border-t border-dashed",
            "border-[var(--impulse-primary)]/30 bg-[var(--impulse-primary)]/5"
          )}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[var(--impulse-primary)]/20 text-[var(--impulse-primary)] text-xs px-2 py-0.5 rounded-b-md">
              Footer (Fixed)
            </div>
          </div>
          
          {/* Edit mode indicator */}
          <div className="fixed top-4 right-4 bg-[var(--impulse-primary)]/80 text-white text-xs py-1 px-3 rounded-full pointer-events-auto">
            Edit Mode Active
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
