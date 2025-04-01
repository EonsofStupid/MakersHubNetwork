
import { useEffect } from "react"
import { AuthProvider as CoreAuthProvider } from "@/hooks/useAuth"
import { notifyAuthReady, notifySignIn, notifySignOut, notifyUserUpdated, notifySessionUpdated, notifyAuthError } from "@/auth/bridge"

// This is just a wrapper around our new AuthProvider for backward compatibility
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Initialize bridge when auth provider loads
    const auth = window.supabase?.auth;
    if (auth) {
      // Listen for auth state changes
      const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
        switch (event) {
          case 'SIGNED_IN':
            notifySignIn(session?.user || null, session, session?.user?.user_metadata?.roles || []);
            break;
          case 'SIGNED_OUT':
            notifySignOut();
            break;
          case 'USER_UPDATED':
            notifyUserUpdated(session?.user || null);
            break;
          case 'TOKEN_REFRESHED':
          case 'MFA_CHALLENGE_VERIFIED':
            notifySessionUpdated(session);
            break;
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  return <CoreAuthProvider>{children}</CoreAuthProvider>
}
