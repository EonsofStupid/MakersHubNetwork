import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/stores/auth/store";
import { supabase } from "@/integrations/supabase/client";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initialize = useAuthStore((state) => state.initialize);
  const initialized = useAuthStore((state) => state.initialized);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    // Initialize auth state
    initialize();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialize, setSession]);

  if (!initialized || isLoading) {
    return <div>Loading global auth...</div>;
  }

  return <>{children}</>;
};