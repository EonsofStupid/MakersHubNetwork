
import { useEffect } from 'react';
import { useAdminStore } from '../store/admin.store';
import { authBridge } from '@/auth/bridge';
import { AuthStatus, LogDetails, UserProfile } from '@/shared/types/shared.types';
import { useLogger } from '@/hooks/use-logger';

export function useAdminAuth() {
  const {
    user,
    status,
    setAdminUser,
    isAuthenticated,
    error
  } = useAdminStore();
  
  const logger = useLogger('AdminAuth', 'ADMIN');

  useEffect(() => {
    const currentUser = authBridge.getCurrentUser();
    
    if (currentUser) {
      setAdminUser(currentUser);
    }
    
    const unsubscribe = authBridge.subscribeToAuthEvents((event, user) => {
      const details: LogDetails = {
        eventType: event,
        hasUser: !!user
      };
      
      logger.info(`Auth event: ${event}`, { details });
      
      if (event === 'SIGNED_IN' && user) {
        setAdminUser(user as UserProfile);
      } else if (event === 'SIGNED_OUT') {
        setAdminUser(null);
      }
    });
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);
  
  return {
    user,
    isAuthenticated,
    isLoading: status === 'LOADING',
    error
  };
}

export default useAdminAuth;
