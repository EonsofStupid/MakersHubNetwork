import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth/store";
import { useToast } from "@/components/ui/use-toast";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Pull these actions from the auth store
  const {
    setUser,
    setSession,
    setRoles,
    setError,
    setLoading,
    setInitialized,
  } = useAuthStore();

  // For example, show a loader if we have a "loading" status
  const { status } = useAuthStore(); // e.g., 'loading' | 'idle' | etc.

  // When app first mounts, do any initial checks
  useEffect(() => {
    // Example: mark store as "loading" while we get session from supabase
    setLoading(true);

    // Check if there's an active session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error(error);
        setError(error.message);
      } else if (session?.user) {
        setSession(session);
        setUser(session.user);
        // You could also fetch roles here if you like
      }
      // Mark store as initialized
      setLoading(false);
      setInitialized(true);
    });
  }, [setLoading, setSession, setUser, setError, setInitialized]);

  // Listen for future auth changes (sign-in, sign-out, token refresh, etc.)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession?.user?.id);

      // Update store
      setSession(currentSession);
      setUser(currentSession?.user || null);

      if (event === "SIGNED_IN" && currentSession?.user) {
        // Fetch user roles from DB
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
        }
      }

      if (event === "SIGNED_OUT") {
        // Clear roles
        setRoles([]);
        // Optionally redirect
        navigate("/login");
        toast({
          title: "Signed out",
          description: "You have been successfully signed out.",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, setRoles, setUser, setError, navigate, toast]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
