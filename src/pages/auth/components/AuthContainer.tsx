import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { AuthForm } from "./AuthForm";
import { TwoFactorVerification } from "./TwoFactorVerification";
import { initializeGamification, handleDailyLogin } from "./gamification/GamificationHandler";

export const AuthContainer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    console.log('AuthContainer mounted - Starting session check');
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Session check result:', session ? 'Session exists' : 'No session');
        
        if (error) {
          if (error.message.includes('refresh_token_not_found')) {
            console.log('Refresh token not found, signing out');
            await supabase.auth.signOut();
            setIsLoading(false);
            return;
          }
          throw error;
        }

        if (session) {
          console.log('Valid session found, checking profile');
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding_completed, role, gamification_enabled')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Profile fetch error:', profileError);
            throw profileError;
          }

          console.log('Profile data:', profile);

          if (!profile?.onboarding_completed) {
            console.log('Onboarding not completed, redirecting');
            navigate("/onboarding");
            return;
          }

          navigate("/");
          return;
        }
      } catch (error) {
        console.error("Session check error:", error);
        setAuthError("Failed to check session status");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    console.log('Setting up auth state change subscription');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
      
      if (event === "SIGNED_IN" && session) {
        try {
          console.log('Processing sign in for user:', session.user.id);
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('onboarding_completed, role, gamification_enabled, two_factor_enabled')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            throw error;
          }

          console.log('Profile data after sign in:', profile);

          if (profile?.two_factor_enabled) {
            console.log('2FA enabled, showing verification');
            setShowTwoFactor(true);
            setCredentials({
              email: session.user.email!,
              password: (session as any).password
            });
            return;
          }

          // Initialize gamification
          const gamificationSuccess = await initializeGamification(session, profile);
          if (gamificationSuccess) {
            const loginSuccess = await handleDailyLogin(session);
            console.log('Daily login processing result:', loginSuccess ? 'Success' : 'Failed');
          }

          toast({
            title: "Welcome!",
            description: "You have successfully signed in.",
          });

          if (!profile?.onboarding_completed) {
            console.log('Redirecting to onboarding');
            navigate("/onboarding");
            return;
          }

          navigate("/");
        } catch (error) {
          console.error("Error in sign in process:", error);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: error instanceof Error ? error.message : "There was a problem verifying your account.",
          });
          await supabase.auth.signOut();
        }
      }
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F1114] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-[#0F1114] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-red-500">{authError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-primary hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (showTwoFactor && credentials) {
    return (
      <div className="min-h-screen bg-[#0F1114] flex items-center justify-center p-4">
        <TwoFactorVerification 
          email={credentials.email}
          password={credentials.password}
        />
      </div>
    );
  }

  return <AuthForm />;
};