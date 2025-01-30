import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth/store";
import { useToast } from "@/components/ui/use-toast";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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
    setLoading(true);
    console.log("Checking initial session...");

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log("Initial session check result:", { session: session?.user?.id, error });
      
      if (error) {
        console.error("Session check error:", error);
        setError(error.message);
        setLoading(false);
        return;
      }

      if (session?.user) {
        setSession(session);
        setUser(session.user);
        
        // Fetch user roles
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .then(({ data: userRoles, error: rolesError }) => {
            if (rolesError) {
              console.error("Error fetching roles:", rolesError);
              setError(rolesError.message);
            } else {
              console.log("Fetched roles:", userRoles);
              setRoles(userRoles?.map((ur) => ur.role) || []);
            }
          });
      }
      
      setLoading(false);
      setInitialized(true);
    });
  }, [setUser, setSession, setRoles, setError, setLoading, setInitialized]);

  // Auth state change listener
  useEffect(() => {
    console.log("Setting up auth state change listener...");
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession?.user?.id);

      if (event === "SIGNED_IN" && currentSession?.user) {
        setSession(currentSession);
        setUser(currentSession.user);
        
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
          console.log("Setting roles:", userRoles);
          setRoles(userRoles?.map((ur) => ur.role) || []);
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
          
          // Only redirect if we're on the login page
          if (location.pathname === '/login') {
            navigate("/");
          }
        }
      }

      if (event === "SIGNED_OUT") {
        console.log("User signed out");
        setSession(null);
        setUser(null);
        setRoles([]);
        
        // Only redirect to login if we're not already there
        if (location.pathname !== '/login') {
          navigate("/login");
          toast({
            title: "Signed out",
            description: "You have been successfully signed out.",
          });
        }
      }
    });

    return () => {
      console.log("Cleaning up auth state change listener...");
      subscription.unsubscribe();
    };
  }, [setSession, setRoles, setUser, setError, navigate, toast, location]);

  return <>{children}</>;
};