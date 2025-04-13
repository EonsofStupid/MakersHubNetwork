import { useEffect } from 'react';
import { useAdminStore } from '../store/admin.store';
import { authBridge } from '@/auth/bridge';
import { LogCategory, UserProfile, AuthStatus } from '@/shared/types/shared.types';
import { useLogger } from '@/hooks/use-logger';

export function useAdminAuth() {
  const {
    user,
    status,
    setAdminUser,
    isAuthenticated,
    error
  } = useAdminStore();
  
  const logger = useLogger('AdminAuth', LogCategory.AUTH);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authBridge.getCurrentUser();
        
        if (currentUser) {
          setAdminUser(currentUser as UserProfile);
        }
        
        const unsubscribe = authBridge.subscribeToAuthEvents((event) => {
          const details = {
            eventType: event.type,
            hasUser: !!event.user
          };
          
          logger.info(`Auth event: ${event.type}`, { details });
          
          if (event.type === 'SIGNED_IN' && event.user) {
            setAdminUser(event.user);
          } else if (event.type === 'SIGNED_OUT') {
            setAdminUser(null);
          }
        });
        
        return () => {
          if (unsubscribe) unsubscribe();
        };
      } catch (error) {
        logger.error('Error initializing admin auth', { details: { error } });
      }
    };
    
    initAuth();
  }, []);
  
  return {
    user,
    isAuthenticated,
    isLoading: status === AuthStatus.LOADING,
    error,
    roles: user?.roles || []
  };
}

export default useAdminAuth;
