
import React from 'react';
import { motion } from 'framer-motion';
import { Check, RefreshCw } from 'lucide-react';
import { useAdminStore } from '@/admin/store/admin.store';

export function SyncIndicator() {
  const { preferencesChanged } = useAdminStore();
  
  return (
    <div className="flex items-center gap-2 text-xs">
      {preferencesChanged ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <RefreshCw className="w-3 h-3 text-[var(--impulse-primary)]" />
            <motion.div 
              className="absolute inset-0 rounded-full"
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(0, 240, 255, 0)",
                  "0 0 0 4px rgba(0, 240, 255, 0.3)",
                  "0 0 0 0 rgba(0, 240, 255, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <span className="text-[var(--impulse-text-secondary)]">Syncing changes...</span>
        </>
      ) : (
        <>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-green-500"
          >
            <Check className="w-3 h-3" />
          </motion.div>
          <span className="text-[var(--impulse-text-secondary)]">All changes saved</span>
        </>
      )}
    </div>
  );
}
