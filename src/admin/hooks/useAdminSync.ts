
import { useEffect } from 'react';
import { subscribeToAuthEvents } from '@/auth/bridge';
import { useAdminStore } from '@/admin/store/admin.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

/**
 * Hook to synchronize admin state with authentication events
 */
export function useAdminSync() {
  const { setPermissions, setIsAuthenticated } = useAdminStore();
  const logger = useLogger('AdminSync', LogCategory.ADMIN);
  
  useEffect(() => {
    logger.info('Setting up admin auth sync');
    
    // Subscribe to authentication events
    const unsubscribe = subscribeToAuthEvents((event) => {
      logger.info(`Admin received auth event: ${event.type}`, {
        details: { eventType: event.type }
      });
      
      switch (event.type) {
        case 'AUTH_SIGNED_IN':
          setIsAuthenticated(true);
          // We'll set permissions via the useAdminPermissions hook
          break;
          
        case 'AUTH_SIGNED_OUT':
          setIsAuthenticated(false);
          setPermissions([]);
          break;
      }
    });
    
    return () => {
      logger.info('Cleaning up admin auth sync');
      unsubscribe();
    };
  }, [logger, setIsAuthenticated, setPermissions]);
}
