import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { MainNav } from "@/components/MainNav";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import HCaptcha from '@hcaptcha/react-hcaptcha';

const Login = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // Auto-redirect on successful auth
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      navigate('/');
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
    }
  });

  // Custom auth UI with hCaptcha integration
  const customAuthComponents = {
    Button: (props: any) => {
      const isSignIn = props.children === 'Sign in';
      return (
        <button
          {...props}
          disabled={isSignIn && !captchaToken}
          className={`w-full p-2 rounded ${
            isSignIn && !captchaToken
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          {props.children}
        </button>
      );
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          side="right" 
          className="w-[400px] backdrop-blur-xl bg-background/80 border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)] transform-gpu before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-secondary/5 before:pointer-events-none"
          style={{
            clipPath: "polygon(20px 0, 100% 0, 100% 100%, 0 100%)",
            transform: "translateX(0) skew(-10deg)",
            transformOrigin: "100% 50%",
          }}
        >
          <div className="transform skew-[10deg] origin-top-right">
            <CardHeader>
              <CardTitle className="text-2xl font-heading text-primary">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Auth
                supabaseClient={supabase}
                view="magic_link"
                providers={['google', 'github']}
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
                    button: 'auth-button',
                    input: 'auth-input',
                  },
                }}
                localization={{
                  variables: {
                    sign_in: {
                      email_label: 'Email',
                      password_label: 'Password',
                      button_label: captchaToken ? 'Sign In' : 'Complete captcha to sign in',
                    },
                  },
                }}
                theme="dark"
                redirectTo={window.location.origin}
                components={customAuthComponents}
              >
                <div className="mt-4 flex justify-center">
                  <HCaptcha
                    sitekey="10000000-ffff-ffff-ffff-000000000001"
                    onVerify={(token) => {
                      setCaptchaToken(token);
                      console.log('hCaptcha Token:', token);
                    }}
                    onExpire={() => {
                      setCaptchaToken(null);
                      console.log('hCaptcha Token Expired');
                    }}
                    onError={(err) => {
                      console.error('hCaptcha Error:', err);
                      toast({
                        title: "Error",
                        description: "Failed to verify captcha. Please try again.",
                        variant: "destructive",
                      });
                    }}
                  />
                </div>
              </Auth>
            </CardContent>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Login;