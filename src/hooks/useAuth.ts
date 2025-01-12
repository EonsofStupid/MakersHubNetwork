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
        setLoading(true);
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          
          // Fetch user roles
          const { data: userRoles, error: rolesError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", initialSession.user.id);
          
          if (rolesError) throw rolesError;
          setRoles(userRoles?.map(ur => ur.role) || []);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === "SIGNED_IN" && currentSession?.user) {
          const { data: userRoles, error: rolesError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", currentSession.user.id);
          
          if (rolesError) {
            console.error("Error fetching roles:", rolesError);
            setError(rolesError.message);
          } else {
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