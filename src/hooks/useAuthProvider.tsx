
import { useEffect } from 'react';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

export function useAuthProvider() {
  const auth = useAuthState();
  const logger = useLogger('useAuthProvider', LogCategory.AUTH);

  useEffect(() => {
    // Get initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        logger.info('Initial session retrieved');
      }
    });
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      logger.info(`Auth state changed: ${event}`, {
        details: { event, userId: session?.user?.id }
      });
    });

    return () => subscription.unsubscribe();
  }, [logger]);

  return auth;
}
