
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';

interface SyncIndicatorProps {
  className?: string;
}

export function SyncIndicator({ className = '' }: SyncIndicatorProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [showTimeTooltip, setShowTimeTooltip] = useState(false);
  
  // Simulate sync events
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% chance of a sync event
      if (Math.random() < 0.1) {
        setIsSyncing(true);
        
        // Sync for 1-3 seconds
        setTimeout(() => {
          setIsSyncing(false);
          setLastSyncTime(Date.now());
        }, 1000 + Math.random() * 2000);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setShowTimeTooltip(true)}
      onMouseLeave={() => setShowTimeTooltip(false)}
    >
      <motion.div
        animate={isSyncing ? { rotate: 360 } : { rotate: 0 }}
        transition={isSyncing ? { duration: 1.5, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
        className={`w-5 h-5 ${isSyncing ? 'text-primary' : 'text-muted-foreground'}`}
      >
        <RefreshCcw size={20} />
      </motion.div>
      
      <AnimatePresence>
        {showTimeTooltip && lastSyncTime && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-muted text-muted-foreground text-xs rounded shadow whitespace-nowrap"
          >
            Last synced: {new Date(lastSyncTime).toLocaleDateString()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
