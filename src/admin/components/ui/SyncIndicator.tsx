
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SyncIndicator() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    // Simulate a sync event every 30 seconds
    const interval = setInterval(() => {
      // Set syncing to true for 1 second
      setIsSyncing(true);
      
      setTimeout(() => {
        setIsSyncing(false);
        setShowSuccess(true);
        
        // Hide success indicator after 2 seconds
        setTimeout(() => setShowSuccess(false), 2000);
      }, 1000);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-center">
      <div className={cn(
        "transition-all duration-200 ease-in-out flex items-center gap-1",
        showSuccess ? "opacity-100" : "opacity-0"
      )}>
        <span className="text-xs text-green-500">Synced</span>
      </div>
      
      <RefreshCw className={cn(
        "w-4 h-4 transition-all ml-1",
        isSyncing ? "text-primary animate-spin" : "text-muted-foreground"
      )} />
    </div>
  );
}
