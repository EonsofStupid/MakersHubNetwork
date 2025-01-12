// src/hooks/useAuth.ts
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth/store";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  selectUser,
  selectSession,
  selectRoles,
  selectIsLoading,
  selectError,
  selectIsAuthenticated,
} from "@/stores/auth/selectors/auth.selectors";

export const useAuth = () => {
  const navigate = useNavigate();
  const user = useAuthStore(selectUser);
  const session = useAuthStore(selectSession);
  const roles = useAuthStore(selectRoles);
  const isLoading = useAuthStore(selectIsLoading);
  const error = useAuthStore(selectError);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  // Now we have setLoading from the store
  const {
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
        // Use setLoading from the store
        setLoading(true);
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);

          const { data: userRoles, error: rolesError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", initialSession.user.id);

          if (rolesError) throw rolesError;
          setRoles(userRoles?.map((ur) => ur.role) || []);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
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
          setRoles(userRoles?.map((ur) => ur.role) || []);
        }
      }

      if (event === "SIGNED_OUT") {
        setRoles([]);
        navigate("/login");
      }
    });

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [
    navigate,
    setUser,
    setSession,
    setRoles,
    setError,
    setLoading,
    setInitialized,
  ]);

  return {
    user,
    session,
    roles,
    isLoading,
    error,
    isAuthenticated,
    logout,
  };
};
