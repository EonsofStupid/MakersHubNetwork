import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Github, Mail, Phone } from "lucide-react";

export const AuthForm = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0F1114] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center p-4 bg-black/80 backdrop-blur-lg border-b border-border/40">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-[#34ebbd] to-[#fa19a7] text-transparent bg-clip-text">
          Sign In
        </h1>
      </div>

      <div className="flex-1 flex flex-col p-4 space-y-6">
        {/* Quick Access Buttons */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <Button 
            variant="outline" 
            className="w-full h-12 flex items-center justify-center gap-2 bg-black/40 backdrop-blur-sm border-border/40 hover:bg-black/60"
            onClick={() => {/* Handle GitHub login */}}
          >
            <Github className="h-5 w-5" />
            Continue with GitHub
          </Button>
          
          <Button
            variant="outline"
            className="w-full h-12 flex items-center justify-center gap-2 bg-black/40 backdrop-blur-sm border-border/40 hover:bg-black/60"
            onClick={() => {/* Handle Google login */}}
          >
            <Mail className="h-5 w-5" />
            Continue with Google
          </Button>

          <Button
            variant="outline"
            className="w-full h-12 flex items-center justify-center gap-2 bg-black/40 backdrop-blur-sm border-border/40 hover:bg-black/60"
            onClick={() => {/* Handle Discord login */}}
          >
            <Phone className="h-5 w-5" />
            Continue with Discord
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/40" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0F1114] px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Supabase Auth UI */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-black/60 backdrop-blur-xl p-6 rounded-lg shadow-lg border border-border/40"
        >
          <Auth 
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              extend: true,
              variables: {
                default: {
                  colors: {
                    brand: '#34ebbd',
                    brandAccent: '#fa19a7',
                    brandButtonText: 'white',
                    defaultButtonBackground: '#34ebbd',
                    defaultButtonBackgroundHover: '#fa19a7',
                    defaultButtonBorder: 'transparent',
                    defaultButtonText: 'white',
                    dividerBackground: '#2D2D2D',
                    inputBackground: 'transparent',
                    inputBorder: '#2D2D2D',
                    inputBorderHover: '#4D4D4D',
                    inputBorderFocus: '#34ebbd',
                    inputText: 'white',
                    inputLabelText: '#666',
                    inputPlaceholder: '#444',
                  },
                },
              },
              className: {
                container: 'space-y-4',
                button: 'w-full h-12 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] font-medium',
                label: 'text-sm font-medium text-gray-400',
                input: 'h-12 bg-black/40 border-border/40 text-white rounded-lg px-4',
                message: 'text-red-500 text-sm',
                divider: 'bg-border/40',
                anchor: 'text-primary hover:text-primary/80 transition-colors',
              },
            }}
            theme="dark"
            providers={['github', 'google', 'discord']}
            redirectTo={`${window.location.origin}/`}
            onlyThirdPartyProviders
          />
        </motion.div>

        {/* Navigation Links */}
        <div className="mt-8 space-y-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-primary"
            onClick={() => navigate('/help')}
          >
            Need help?
          </Button>
          <Button 
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-primary"
            onClick={() => navigate('/privacy')}
          >
            Privacy Policy
          </Button>
          <Button 
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-primary"
            onClick={() => navigate('/terms')}
          >
            Terms of Service
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;