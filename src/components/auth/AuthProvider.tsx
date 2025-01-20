import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth/store";
import { useToast } from "@/components/ui/use-toast";
import { AuthError } from "@supabase/supabase-js";

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

  const handleAuthError = (error: AuthError, context: string) => {
    console.error(`Auth error (${context}):`, error);
    
    // Handle specific error cases
    if (error.message.includes('refresh_token_not_found')) {
      setSession(null);
      setUser(null);
      setRoles([]);
      navigate('/login');
      toast({
        variant: "destructive",
        title: "Session Expired",
        description: "Please sign in again to continue.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message,
      });
    }
    setError(error.message);
  };

  // Initial session check
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        console.log("Initializing auth session...");

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        console.log("Session check result:", { 
          sessionExists: !!session,
          userId: session?.user?.id 
        });

        if (session?.user) {
          setSession(session);
          setUser(session.user);

          // Fetch user roles
          const { data: userRoles, error: rolesError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id);

          if (rolesError) {
            console.error("Error fetching roles:", rolesError);
            throw rolesError;
          }

          console.log("Fetched roles:", userRoles);
          setRoles(userRoles?.map((ur) => ur.role) || []);
        } else {
          // No session found
          setSession(null);
          setUser(null);
          setRoles([]);
          if (location.pathname !== '/login') {
            navigate('/login');
          }
        }
      } catch (error) {
        handleAuthError(error as AuthError, 'initialization');
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, [setUser, setSession, setRoles, setError, setLoading, setInitialized, navigate, location.pathname]);

  // Auth state change listener
  useEffect(() => {
    console.log("Setting up auth state change listener...");
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", { event, userId: currentSession?.user?.id });

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
          
          if (location.pathname === '/login') {
            navigate("/");
          }
        }

        if (event === "SIGNED_OUT" || event === "USER_DELETED") {
          console.log("User signed out or deleted");
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

        if (event === "TOKEN_REFRESHED") {
          console.log("Token refreshed successfully");
        }

      } catch (error) {
        handleAuthError(error as AuthError, 'state change');
      }
    });

    return () => {
      console.log("Cleaning up auth state change listener...");
      subscription.unsubscribe();
    };
  }, [setSession, setRoles, setUser, setError, navigate, location.pathname, toast]);

  return <>{children}</>;
};