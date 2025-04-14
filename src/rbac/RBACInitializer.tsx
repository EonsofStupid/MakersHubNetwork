
import { useEffect } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from './bridge';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';
import type { UserRole } from '@/shared/types/shared.types';

export const RBACInitializer = () => {
  const { isAuthenticated, user } = useAuthStore();
  const logger = useLogger('RBACInitializer', LogCategory.RBAC);

  useEffect(() => {
    if (isAuthenticated && user) {
      const roles = (user.roles || []) as UserRole[];
      RBACBridge.setRoles(roles);
      logger.info('User roles set in RBAC', { roles });
    } else {
      RBACBridge.clearRoles();
      logger.info('RBAC roles cleared (not authenticated)');
    }
  }, [isAuthenticated, user, logger]);

  return null;
};
