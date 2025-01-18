import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth/store";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  selectUser,
  selectSession,
  selectRoles,
  selectIsLoading,
  selectError,
  selectIsAuthenticated,
  selectIsAdmin,
} from "@/stores/auth/selectors/auth.selectors";

export const useAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useAuthStore(selectUser);
  const session = useAuthStore(selectSession);
  const roles = useAuthStore(selectRoles);
  const isLoading = useAuthStore(selectIsLoading);
  const error = useAuthStore(selectError);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isAdmin = useAuthStore(selectIsAdmin);
  
  const {
    setUser,
    setSession,
    setRoles,
    setError,
    setLoading,
    setInitialized,
    logout,
    hasRole,
  } = useAuthStore();

  useEffect(() => {
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
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to fetch user roles.",
            });
          } else {
            setRoles(userRoles?.map(ur => ur.role) || []);
            toast({
              title: "Welcome back!",
              description: "You have successfully signed in.",
            });
          }
        }

        if (event === "SIGNED_OUT") {
          setRoles([]);
          navigate("/login");
          toast({
            title: "Signed out",
            description: "You have been successfully signed out.",
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, setUser, setSession, setRoles, setError, toast]);

  return {
    user,
    session,
    roles,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    hasRole,
    logout,
  };
};