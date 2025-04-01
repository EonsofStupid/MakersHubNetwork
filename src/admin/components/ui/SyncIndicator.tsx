
import React, { useState, useEffect } from 'react';
import { Loader, Check } from 'lucide-react';
import { useAdminSync } from '@/admin/hooks/useAdminSync';
import { AdminTooltip } from './AdminTooltip';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

export function SyncIndicator() {
  const { isSyncing, lastSyncTime, syncError } = useAdminSync();
  const [showSuccess, setShowSuccess] = useState(false);
  const logger = useLogger("SyncIndicator", LogCategory.ADMIN);

  useEffect(() => {
    if (!isSyncing && !syncError && lastSyncTime) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSyncing, syncError, lastSyncTime]);

  useEffect(() => {
    if (syncError) {
      logger.error("Sync error occurred", { details: { error: syncError } });
    }
  }, [syncError, logger]);

  if (!isSyncing && !showSuccess) {
    return null;
  }

  const tooltipContent = isSyncing
    ? "Syncing admin data..."
    : syncError
    ? `Sync error: ${syncError}`
    : `Last synced: ${lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString() : 'Never'}`;

  return (
    <AdminTooltip content={tooltipContent} side="bottom">
      <div className="flex items-center gap-1">
        {isSyncing ? (
          <Loader className="h-4 w-4 text-[var(--impulse-primary)] animate-spin" />
        ) : (
          <Check className="h-4 w-4 text-green-500" />
        )}
      </div>
    </AdminTooltip>
  );
}
