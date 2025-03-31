
import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudOff } from 'lucide-react';
import { useAdminSync } from '@/admin/hooks/useAdminSync';

export function SyncIndicator() {
  const { isSyncing, lastSyncTime } = useAdminSync();
  
  return (
    <div className="flex items-center gap-2 text-xs">
      {isSyncing ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Cloud className="h-3 w-3 text-primary" />
          </motion.div>
          <span className="text-muted-foreground">Syncing...</span>
        </>
      ) : (
        <>
          <Cloud className="h-3 w-3 text-primary" />
          <span className="text-muted-foreground">
            {lastSyncTime ? `Last synced: ${lastSyncTime.toLocaleTimeString()}` : 'Synced'}
          </span>
        </>
      )}
    </div>
  );
}
