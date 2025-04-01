
import React from 'react';
import { useAdminSync } from '@/admin/hooks/useAdminSync';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Loader2, CloudOff } from 'lucide-react';

export const SyncIndicator = () => {
  const { isSyncing, lastSyncTime, syncError, saveToDatabase } = useAdminSync();

  if (isSyncing) {
    return (
      <Badge variant="outline" className="gap-1">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>Syncing...</span>
      </Badge>
    );
  }

  if (syncError) {
    return (
      <Badge variant="destructive" className="gap-1">
        <CloudOff className="w-3 h-3" />
        <span>Sync Failed</span>
      </Badge>
    );
  }

  if (lastSyncTime) {
    return (
      <Badge variant="outline" className="gap-1 bg-muted/30 hover:bg-muted/50">
        <CheckCircle className="w-3 h-3" />
        <span>Synced {lastSyncTime.toLocaleTimeString()}</span>
      </Badge>
    );
  }

  return null;
};
