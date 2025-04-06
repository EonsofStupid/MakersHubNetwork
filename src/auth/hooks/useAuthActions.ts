
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

/**
 * Hook for auth-related actions
 */
export function useAuthActions() {
  const { status } = useAuthState();
  const logger = useLogger('AuthActions', LogCategory.AUTH);
  
  const logout = useCallback(async () => {
    try {
      if (status === 'loading') {
        logger.warn('Cannot logout while authentication is loading');
        return;
      }
      
      logger.info('Logging out user');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        logger.error('Error during logout', { details: { error: error.message } });
        throw error;
      }
      
      logger.info('User logged out successfully');
      
      // Reload the page to clear all state
      window.location.href = '/';
    } catch (error) {
      logger.error('Failed to logout', { 
        details: { error: error instanceof Error ? error.message : String(error) } 
      });
    }
  }, [status, logger]);
  
  return { logout };
}
