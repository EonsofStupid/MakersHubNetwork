
import React from 'react';
import { motion } from 'framer-motion';
import { useAdminSync } from '@/admin/hooks/useAdminSync';
import { Cloud, CheckCircle } from 'lucide-react';

export function SyncIndicator() {
  const { isSyncing, lastSyncTime } = useAdminSync();
  
  return (
    <div className="flex items-center gap-2 text-xs">
      {isSyncing ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Cloud className="w-3 h-3 text-primary" />
          </motion.div>
          <span>Syncing...</span>
        </>
      ) : (
        <>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <CheckCircle className="w-3 h-3 text-green-500" />
          </motion.div>
          <span>
            {lastSyncTime ? `Synced ${lastSyncTime.toLocaleTimeString()}` : 'Ready'}
          </span>
        </>
      )}
    </div>
  );
}
