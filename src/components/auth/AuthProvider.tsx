import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/stores/auth/store";
import { supabase } from "@/integrations/supabase/client";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const setSession = useAuthStore((state) => state.setSession);
  const initialize = useAuthStore((state) => state.initialize);
  const initialized = useAuthStore((state) => state.initialized);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      try {
        await initialize();
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      }
    };

    initAuth();

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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-primary">Loading authentication...</div>
      </div>
    );
  }

  return <>{children}</>;
};