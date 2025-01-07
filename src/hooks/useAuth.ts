import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth/store";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();
  const {
    user,
    session,
    roles,
    isLoading,
    error,
    setUser,
    setSession,
    setRoles,
    setError,
    setLoading,
    setInitialized,
    logout,
  } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          
          // Fetch user roles
          const { data: userRoles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", initialSession.user.id);
          
          setRoles(userRoles?.map(ur => ur.role) || []);
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === "SIGNED_IN") {
          // Fetch user roles on sign in
          if (currentSession?.user) {
            const { data: userRoles } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", currentSession.user.id);
            
            setRoles(userRoles?.map(ur => ur.role) || []);
          }
        }

        if (event === "SIGNED_OUT") {
          setRoles([]);
          navigate("/login");
        }
      }
    );

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, setUser, setSession, setRoles, setError, setLoading, setInitialized]);

  return {
    user,
    session,
    roles,
    isLoading,
    error,
    isAuthenticated: !!user,
    logout,
  };
};