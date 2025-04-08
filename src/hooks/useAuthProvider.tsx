
import { useEffect, useRef } from 'react';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

export function useAuthProvider() {
  const auth = useAuthState();
  const logger = useLogger('useAuthProvider', LogCategory.AUTH);
  const initialized = useRef(false);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  // Only set up listener once on mount, don't recreate
  useEffect(() => {
    if (initialized.current || subscriptionRef.current) return;
    initialized.current = true;
    
    // Avoid calling getSession which might trigger state changes during render
    // We're using the auth store's initialization instead
    
    // Set up auth state change listener
    if (!subscriptionRef.current) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        logger.info(`Auth state changed: ${event}`, {
          details: { event, userId: session?.user?.id }
        });
      });
      
      subscriptionRef.current = subscription;
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [logger]);

  return auth;
}
