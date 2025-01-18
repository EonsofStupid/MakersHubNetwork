import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface LoginProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const Login = ({ open, onOpenChange, onSuccess }: LoginProps) => {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [siteKey, setSiteKey] = useState<string>('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSiteKey = async () => {
      try {
        const { data, error } = await supabase
          .functions.invoke('get-secret', {
            body: { secretName: 'HCAPTCHA_SITE_KEY' }
          });

        if (error) throw error;
        if (!data?.HCAPTCHA_SITE_KEY) throw new Error('Site key not found');
        
        setSiteKey(data.HCAPTCHA_SITE_KEY);
      } catch (error) {
        console.error('Error fetching hCaptcha site key:', error);
        toast({
          title: "Error",
          description: "Failed to initialize captcha. Please try again later.",
          variant: "destructive",
        });
      }
    };

    if (open) {
      fetchSiteKey();
    }
  }, [open, toast]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        onSuccess?.();
        navigate('/');
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, onSuccess, toast]);

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
  };

  const handleCaptchaExpire = () => {
    setCaptchaToken(null);
    toast({
      title: "Captcha Expired",
      description: "Please complete the captcha again",
      variant: "destructive",
    });
  };

  const handleCaptchaError = (event: string) => {
    console.error('hCaptcha Error:', event);
    toast({
      title: "Error",
      description: "Failed to verify captcha. Please try again.",
      variant: "destructive",
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-[400px] backdrop-blur-xl bg-background/80 border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)] transform-gpu"
        style={{
          clipPath: "polygon(0 0, 100% 0, 95% 15%, 100% 30%, 95% 85%, 100% 100%, 0 100%)",
          transform: "translateX(0) skew(-5deg)",
          transformOrigin: "100% 50%",
        }}
      >
        <div className="transform skew-[5deg] origin-top-right">
          <h2 className="text-2xl font-heading text-primary mb-6">Welcome Back</h2>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#00F0FF',
                    brandAccent: '#FF2D6E',
                    brandButtonText: 'white',
                    defaultButtonBackground: 'transparent',
                    defaultButtonBackgroundHover: 'rgba(0, 240, 255, 0.1)',
                    defaultButtonBorder: '#00F0FF',
                    defaultButtonText: '#00F0FF',
                  },
                  radii: {
                    borderRadiusButton: '0.5rem',
                    buttonBorderRadius: '0.5rem',
                    inputBorderRadius: '0.5rem',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: `auth-button ${!captchaToken ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`,
                input: 'auth-input',
              },
            }}
            theme="dark"
            providers={['github', 'google', 'discord']}
            view="sign_in"
            showLinks={true}
            redirectTo={window.location.origin}
          />
          <div className="mt-4 flex justify-center">
            {siteKey && (
              <HCaptcha
                sitekey={siteKey}
                onVerify={handleCaptchaVerify}
                onExpire={handleCaptchaExpire}
                onError={handleCaptchaError}
              />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Login;