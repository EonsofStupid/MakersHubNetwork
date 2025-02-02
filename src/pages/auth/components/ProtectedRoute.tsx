import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Session verification timeout")), 5000)
        );
        
        const sessionPromise = supabase.auth.getSession();

        const result = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as { data: { session: any } | null, error: any };
        
        if (result.error) throw result.error;
        
        if (!result.data?.session) {
          toast({
            variant: "destructive",
            title: "Authentication Required",
            description: "Please sign in to access this page.",
          });
          navigate("/auth");
        }
      } catch (error) {
        console.error("Session error:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem verifying your session. Please sign in again.",
        });
        navigate("/auth");
      } finally {
        setIsVerifying(false);
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, supabase, toast]);

  if (isLoading || isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return session ? <>{children}</> : null;
};
