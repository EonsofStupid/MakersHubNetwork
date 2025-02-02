import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthSetup } from '@/hooks/useAuthSetup';
import { motion } from "framer-motion";
import { toast } from "sonner";
import { applySecurityHeaders } from "@/utils/auth/securityHeaders";
import { sessionManager } from "@/lib/auth/SessionManager";
import { securityManager } from "@/lib/auth/SecurityManager";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { handleAuthChange, initialSetupDone } = useAuthSetup();

  useEffect(() => {
    console.log('AuthProvider mounted - Starting initialization');
    
    // Apply security headers
    const initSecurity = async () => {
      try {
        const success = await applySecurityHeaders();
        if (!success) {
          console.warn('Security headers could not be applied, continuing with default security settings');
        }
      } catch (error) {
        console.error('Error initializing security headers:', error);
      }
    };

    initSecurity();

    if (initialSetupDone.current) {
      console.log('Initial setup already done, skipping');
      return;
    }
    
    initialSetupDone.current = true;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000;

    const setupAuth = async () => {
      try {
        console.log('Starting auth setup');
        
        // Initialize security systems first
        try {
          sessionManager.startSession();
          securityManager.initialize();
          console.log('Security systems initialized');
        } catch (securityError) {
          console.error('Error initializing security systems:', securityError);
          // Continue with auth setup even if security init fails
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          if (sessionError.message.includes('refresh_token_not_found')) {
            console.log('Refresh token not found, signing out');
            await supabase.auth.signOut();
            return;
          }
          throw sessionError;
        }

        console.log('Initial session check:', session?.user?.id || 'No session');
        await handleAuthChange(session);

      } catch (error) {
        console.error("Auth setup error:", error);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying auth setup (${retryCount}/${maxRetries})...`);
          setTimeout(setupAuth, retryDelay * retryCount);
        } else {
          toast.error('Failed to initialize authentication', {
            description: 'Please refresh the page or try again later.',
          });
        }
      }
    };

    setupAuth();

    console.log('Setting up auth state change subscription');
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        console.log('Auth state changed:', _event, session?.user?.id);
        await handleAuthChange(session);
      } catch (error) {
        console.error('Auth state change error:', error);
        toast.error('Authentication error', {
          description: 'There was a problem with your session. Please try signing in again.',
        });
      }
    });
    
    return () => {
      console.log('Cleaning up AuthProvider');
      subscription.unsubscribe();
      sessionManager.destroy();
      securityManager.cleanup();
    };
  }, [handleAuthChange]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};