import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth/store";
import { useToast } from "@/components/ui/use-toast";

export const AuthProvider = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const {
    setUser,
    setSession,
    setRoles,
    setError,
    setLoading,
    setInitialized,
  } = useAuthStore();

  // Initial session check
  useEffect(() => {
    let ignore = false;
    
    const checkSession = async () => {
      if (!ignore) {
        setLoading(true);
        console.log("Checking initial session...");

        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          console.log("Initial session check result:", { session: session?.user?.id, error });
          
          if (error) throw error;

          if (session?.user) {
            setSession(session);
            setUser(session.user);
            
            // Fetch user roles
            const { data: userRoles, error: rolesError } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", session.user.id);

            if (rolesError) throw rolesError;
            
            console.log("Fetched roles:", userRoles);
            setRoles(userRoles?.map((ur) => ur.role) || []);
            
            // If on login page, redirect to home
            if (location.pathname === '/login') {
              navigate('/');
            }
          }
        } catch (error) {
          console.error("Session check error:", error);
          setError(error instanceof Error ? error.message : 'An error occurred');
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: error instanceof Error ? error.message : 'Failed to check authentication status',
          });
        } finally {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    checkSession();
    return () => { ignore = true; };
  }, [setUser, setSession, setRoles, setError, setLoading, setInitialized, navigate, location, toast]);

  // Auth state change listener
  useEffect(() => {
    console.log("Setting up auth state change listener...");
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession?.user?.id);

      try {
        if (event === "SIGNED_IN" && currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          const { data: userRoles, error: rolesError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", currentSession.user.id);

          if (rolesError) throw rolesError;

          console.log("Setting roles:", userRoles);
          setRoles(userRoles?.map((ur) => ur.role) || []);
          
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });

          // Redirect to home page after successful login
          navigate('/');
        }

        if (event === "SIGNED_OUT") {
          console.log("User signed out");
          setSession(null);
          setUser(null);
          setRoles([]);
          
          toast({
            title: "Signed out",
            description: "You have been successfully signed out.",
          });

          // Redirect to home page after logout
          navigate('/');
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        setError(error instanceof Error ? error.message : 'An error occurred');
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : 'An error occurred during authentication',
        });
      }
    });

    return () => {
      console.log("Cleaning up auth state change listener...");
      subscription.unsubscribe();
    };
  }, [setSession, setRoles, setUser, setError, navigate, toast]);

  return <Outlet />;
};