
import React from 'react';
import { motion } from 'framer-motion';
import { useAdminSync } from '@/admin/hooks/useAdminSync';
import { Icons } from '@/components/ui/icons';
import { AdminTooltip } from './AdminTooltip';

export function SyncIndicator() {
  const { isSyncing, lastSynced, sync } = useAdminSync();
  
  const formatLastSynced = () => {
    if (!lastSynced) return 'Never synced';
    
    // If synced less than 1 minute ago
    const diff = Math.floor((Date.now() - lastSynced.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    
    // If synced less than 1 hour ago
    if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    
    // Otherwise show time
    return lastSynced.toLocaleTimeString();
  };
  
  return (
    <AdminTooltip content={`Last synced: ${formatLastSynced()}`} side="bottom">
      <button 
        onClick={() => !isSyncing && sync()}
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[var(--impulse-border-hover)] text-[var(--impulse-text-primary)]"
        disabled={isSyncing}
      >
        {isSyncing ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Icons.loader className="w-4 h-4 text-[var(--impulse-primary)]" />
          </motion.div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-4 h-4 rounded-full border-2 border-[var(--impulse-primary)] flex items-center justify-center">
              <div className="w-2 h-2 bg-[var(--impulse-primary)] rounded-full" />
            </div>
          </motion.div>
        )}
      </button>
    </AdminTooltip>
  );
}
