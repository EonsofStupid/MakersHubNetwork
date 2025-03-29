
import React from 'react';
import { Loader, Check, X, CloudOff } from 'lucide-react';
import { useSharedStore } from '@/stores/shared/store';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuthStore } from '@/stores/auth/store';

export const SYNC_ID = 'admin-sync';

export function SyncIndicator() {
  const { loading, errors } = useSharedStore();
  const { user } = useAuthStore();
  
  const isLoading = loading[SYNC_ID]?.isLoading;
  const error = errors[SYNC_ID];
  const isOffline = !navigator.onLine;
  const isAuthenticated = !!user?.id;
  
  if (!isAuthenticated) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center text-sm text-muted-foreground/70">
              <CloudOff size={14} className="mr-1 text-muted-foreground/70" />
              <span>Local only</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sign in to save your preferences across devices</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  if (isOffline) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center text-sm text-amber-500">
              <CloudOff size={14} className="mr-1" />
              <span>Offline</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>You are offline. Changes will sync when you reconnect.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  if (isLoading) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center text-sm text-muted-foreground animate-pulse">
              <Loader size={14} className="mr-1 animate-spin" />
              <span>{loading[SYNC_ID]?.message || 'Syncing...'}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{loading[SYNC_ID]?.message || 'Syncing your preferences...'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  if (error) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center text-sm text-destructive">
              <X size={14} className="mr-1" />
              <span>Sync error</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{error.message || 'Failed to sync preferences'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center text-sm text-muted-foreground">
            <Check size={14} className="mr-1 text-primary" />
            <span>Synced</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Your preferences are synced across devices</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
