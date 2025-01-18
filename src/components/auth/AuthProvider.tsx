import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth/store";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setSession, setRoles, setError, initialize } = useAuthStore();

  // Single source of truth for auth state
  useEffect(() => {
    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);

        if (session?.user) {
          const { data: userRoles, error: rolesError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id);
          
          if (rolesError) {
            setError(rolesError.message);
          } else {
            setRoles(userRoles?.map(ur => ur.role) || []);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, setRoles, setError, initialize]);

  return <>{children}</>;
};