
import React from 'react';
import { useAdminSync } from '@/admin/hooks/useAdminSync';
import { RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const SyncIndicator: React.FC = () => {
  const { lastSyncTime, isSyncing, syncAdminData } = useAdminSync();
  
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span>
        {lastSyncTime 
          ? `Last synced ${formatDistanceToNow(lastSyncTime, { addSuffix: true })}` 
          : 'Not synced yet'}
      </span>
      <button 
        onClick={() => syncAdminData()} 
        disabled={isSyncing} 
        className="p-1 rounded-full hover:bg-accent/10 transition-colors"
        title="Sync now"
      >
        <RefreshCw 
          size={14} 
          className={`text-muted-foreground ${isSyncing ? 'animate-spin' : ''}`} 
        />
      </button>
    </div>
  );
};
