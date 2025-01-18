import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth/store";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    setSession,
    setRoles,
    setError,
    setLoading,
    setInitialized,
    initialize,
    status
  } = useAuthStore();

  // Initial auth state setup
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        
        setSession(currentSession);

        if (currentSession?.user) {
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
            if (event === 'SIGNED_IN') {
              toast({
                title: "Welcome back!",
                description: "You have successfully signed in.",
              });
            }
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
  }, [setSession, setRoles, setError, navigate, toast]);

  // Loading state
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};