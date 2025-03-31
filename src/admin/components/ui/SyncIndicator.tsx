
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
          >
            <RefreshCw className="w-3 h-3 text-primary" />
          </motion.div>
          <span className="text-muted-foreground">Syncing...</span>
        </>
      ) : (
        <>
          <Check className="w-3 h-3 text-green-500" />
          <span className="text-muted-foreground">Synced</span>
        </>
      )}
    </div>
  );
}
