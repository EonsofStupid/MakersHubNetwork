import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth/store";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "../ui/use-toast";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser, setSession, setRoles, setError, setLoading, setInitialized } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          
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
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem initializing your session.",
        });
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

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

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, setUser, setSession, setRoles, setError, setLoading, setInitialized, toast]);

  return <>{children}</>;
};