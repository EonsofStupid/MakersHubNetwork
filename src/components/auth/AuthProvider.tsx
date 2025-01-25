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
    let mounted = true;
    let initialCheckDone = false;

    const checkSession = async () => {
      if (initialCheckDone) return;
      
      try {
        if (mounted) setLoading(true);
        console.log("Checking initial session...");

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error("Session check error:", error);
          setError(error.message);
          return;
        }

        if (session?.user) {
          setSession(session);
          setUser(session.user);
          
          const { data: userRoles, error: rolesError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id);

          if (!mounted) return;

          if (rolesError) {
            console.error("Error fetching roles:", rolesError);
            setError(rolesError.message);
          } else {
            console.log("Fetched roles:", userRoles);
            setRoles(userRoles?.map((ur) => ur.role) || []);
          }
        } else {
          setSession(null);
          setUser(null);
          setRoles([]);
        }
      } catch (err) {
        if (mounted) {
          console.error("Unexpected error during session check:", err);
          setError(err instanceof Error ? err.message : "An unexpected error occurred");
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
          initialCheckDone = true;
        }
      }
    };

    checkSession();

    return () => {
      mounted = false;
    };
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
          setRoles(userRoles?.map((ur) => ur.role) || []);
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
          
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