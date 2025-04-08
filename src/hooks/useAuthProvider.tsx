
import { useEffect, useRef } from 'react';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

export function useAuthProvider() {
  const auth = useAuthState();
  const logger = useLogger('useAuthProvider', LogCategory.AUTH);
  const initialized = useRef(false);

  // Only run once on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    // Get initial auth state without triggering additional initialization
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        logger.info('Initial session retrieved');
      }
    });
    
    // Set up auth state change listener
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
