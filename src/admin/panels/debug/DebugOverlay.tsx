
import React from 'react';
import { useDebugOverlay } from '../../hooks/useDebugOverlay';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from '@/rbac/bridge';

export const DebugOverlay: React.FC = () => {
  const { isVisible, hasAccess } = useDebugOverlay();
  const logger = useLogger('DebugOverlay', LogCategory.ADMIN);
  const user = useAuthStore(state => state.user);
  const roles = RBACBridge.getRoles();

  if (!hasAccess || !isVisible) {
    return null;
  }

  logger.debug('Rendering debug overlay');

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white p-4 rounded-lg shadow-lg font-mono text-sm">
      <div className="mb-2 font-bold">Debug Info</div>
      <div className="space-y-1">
        <div>User: {user?.email || 'Not logged in'}</div>
        <div>Roles: {roles.join(', ') || 'No roles'}</div>
        <div>Timestamp: {new Date().toISOString()}</div>
      </div>
    </div>
  );
};
