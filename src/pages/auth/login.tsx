import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from '@/lib/store/auth-store';
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PinLogin } from "@/components/auth/components/PinLogin";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { sessionManager } from '@/lib/auth/SessionManager';
import { securityManager } from '@/lib/auth/SecurityManager';
import { ErrorBoundary } from "@/components/shared/error-handling/ErrorBoundary";

const LoginContent = () => {
  const navigate = useNavigate();
  const { session, isLoading } = useAuthStore();
  const [usePinLogin, setUsePinLogin] = useState(false);

  useEffect(() => {
    console.log('Login page render:', { session, isLoading });
    
    if (session?.user) {
      console.log("Existing session found, redirecting to home");
      navigate("/");
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed in login:", event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          await sessionManager.startSession();
          securityManager.initialize();
          
          console.log("User signed in, redirecting to home");
          toast.success("Successfully signed in!");
          navigate("/");
        } catch (error) {
          console.error('Error initializing session:', error);
          toast.error('Error signing in', {
            description: 'There was a problem initializing your session'
          });
          await supabase.auth.signOut();
        }
      }
    });

    return () => {
      console.log("Cleaning up auth listener in login page");
      subscription.unsubscribe();
    };
  }, [session, navigate, isLoading]);

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-[#0F1114]"
      >
        <LoadingSpinner />
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#0F1114] to-[#1A1F2C] flex flex-col relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-cyber-grid opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bg-scratch-overlay opacity-30 pointer-events-none" />
      
      <div className="sticky top-0 z-50 flex items-center p-4 bg-black/40 backdrop-blur-xl border-b border-[#41f0db]/20">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-2 text-white hover:text-[#41f0db]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-[#41f0db] to-[#ff0abe] text-transparent bg-clip-text">
          Sign In
        </h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col p-4 items-center justify-center relative z-10"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-black/30 backdrop-blur-2xl p-8 rounded-xl shadow-xl border border-[#41f0db]/20 relative overflow-hidden"
        >
          {usePinLogin ? (
            <PinLogin onSwitchToPassword={() => setUsePinLogin(false)} />
          ) : (
            <>
              <Auth 
                supabaseClient={supabase}
                appearance={{ 
                  theme: ThemeSupa,
                  extend: true,
                  variables: {
                    default: {
                      colors: {
                        brand: '#41f0db',
                        brandAccent: '#ff0abe',
                        brandButtonText: 'white',
                        defaultButtonBackground: 'rgba(65, 240, 219, 0.1)',
                        defaultButtonBackgroundHover: 'rgba(65, 240, 219, 0.2)',
                        defaultButtonBorder: '#41f0db',
                        defaultButtonText: '#41f0db',
                        inputBackground: 'rgba(0, 0, 0, 0.3)',
                        inputBorder: 'rgba(65, 240, 219, 0.2)',
                        inputBorderHover: 'rgba(65, 240, 219, 0.4)',
                        inputBorderFocus: '#41f0db',
                        inputText: 'white',
                        inputPlaceholder: 'rgba(255, 255, 255, 0.4)',
                      },
                    },
                  },
                  className: {
                    container: 'space-y-4',
                    button: 'w-full h-12 rounded-lg transition-all duration-300 backdrop-blur-sm border border-[#41f0db]/20 hover:border-[#41f0db]/40 hover:bg-[#41f0db]/10',
                    label: 'text-sm font-medium text-[#41f0db]',
                    input: 'h-12 w-full bg-black/20 backdrop-blur-sm border border-[#41f0db]/20 hover:border-[#41f0db]/40 focus:border-[#41f0db] text-white rounded-lg px-4',
                    message: 'text-red-400 text-sm',
                    anchor: 'text-[#41f0db] hover:text-[#ff0abe] transition-colors',
                    divider: 'bg-[#41f0db]/20',
                  },
                }}
                theme="dark"
                providers={['github', 'google', 'discord']}
                redirectTo={`${window.location.origin}/`}
                magicLink={true}
              />
              <Button
                variant="ghost"
                className="w-full mt-4"
                onClick={() => setUsePinLogin(true)}
              >
                Login with PIN
              </Button>
            </>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const Login = () => {
  return (
    <ErrorBoundary>
      <LoginContent />
    </ErrorBoundary>
  );
};

export default Login;