
import React from 'react';
import { motion } from 'framer-motion';
import { CloudCheck, CloudOff, RotateCw } from 'lucide-react';
import { useAdminStore } from '@/admin/store/admin.store';

export function SyncIndicator() {
  const { syncing, syncError, lastSynced } = useAdminStore();
  
  if (syncError) {
    return (
      <div className="flex items-center text-xs text-red-500">
        <CloudOff className="w-3 h-3 mr-1" />
        <span>Sync error</span>
      </div>
    );
  }
  
  if (syncing) {
    return (
      <div className="flex items-center text-xs text-[var(--impulse-text-secondary)]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <RotateCw className="w-3 h-3 mr-1" />
        </motion.div>
        <span>Syncing...</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center text-xs text-[var(--impulse-text-secondary)]">
      <CloudCheck className="w-3 h-3 mr-1 text-green-500" />
      <span>
        {lastSynced 
          ? `Synced ${new Date(lastSynced).toLocaleTimeString()}` 
          : 'Up to date'}
      </span>
    </div>
  );
}
