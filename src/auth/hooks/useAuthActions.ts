
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useAuthStore } from '@/auth/store/auth.store';

/**
 * Hook for auth-related actions
 */
export function useAuthActions() {
  const { status } = useAuthState();
  const logger = useLogger('AuthActions', LogCategory.AUTH);
  // Get logout function directly from store to avoid circular dependencies
  const storeLogout = useAuthStore(state => state.logout);
  
  const logout = useCallback(async () => {
    try {
      if (status === 'loading') {
        logger.warn('Cannot logout while authentication is loading');
        return;
      }
      
      logger.info('Logging out user');
      await storeLogout();
      
      logger.info('User logged out successfully');
    } catch (error) {
      logger.error('Failed to logout', { 
        details: { error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }, [status, logger, storeLogout]);
  
  return { logout };
}
