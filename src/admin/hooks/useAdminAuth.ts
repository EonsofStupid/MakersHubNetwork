
import { useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory, UserRole } from '@/shared/types/shared.types';
import { authBridge } from '@/bridges/AuthBridge';
import { useAdminStore } from '../store/admin.store';

/**
 * Hook for handling admin-specific auth functionality
 */
export function useAdminAuth() {
  const auth = useAuth();
  const { setAdminUser } = useAdminStore();
  const logger = useLogger('useAdminAuth', LogCategory.AUTH);
  
  // Check if user has admin access
  const hasAdminAccess = useCallback(() => {
    return auth.hasRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  }, [auth]);

  // Subscribe to auth events
  useEffect(() => {
    logger.debug('Setting up admin auth listeners');
    
    const unsubscribe = authBridge.subscribeToAuthEvents((event) => {
      logger.debug('Auth event received in admin context', { eventType: event.type });
      
      if (event.user) {
        setAdminUser(event.user);
      } else {
        setAdminUser(null);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [logger, setAdminUser]);

  return {
    ...auth,
    hasAdminAccess,
  };
}
