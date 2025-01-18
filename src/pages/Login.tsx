import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useAuth } from "@/hooks/useAuth";
import { User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [siteKey, setSiteKey] = useState<string>('');
  const { user, roles, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch the hCaptcha site key from Supabase
    const fetchSiteKey = async () => {
      const { data: { HCAPTCHA_SITE_KEY }, error } = await supabase
        .functions.invoke('get-secret', {
          body: { secretName: 'HCAPTCHA_SITE_KEY' }
        });
      
      if (error) {
        console.error('Error fetching hCaptcha site key:', error);
        toast({
          title: "Error",
          description: "Failed to initialize captcha. Please try again later.",
          variant: "destructive",
        });
        return;
      }
      
      setSiteKey(HCAPTCHA_SITE_KEY);
    };

    fetchSiteKey();
  }, [toast]);

  // Auto-redirect on successful auth
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/');
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

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

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = roles.includes("admin") || roles.includes("super_admin");

  // Render user menu if logged in
  if (user) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          side="right" 
          className="w-[300px] backdrop-blur-xl bg-background/80 border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)] transform-gpu before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-secondary/5 before:pointer-events-none"
          style={{
            clipPath: "polygon(20px 0, 100% 0, 100% 100%, 0 100%)",
            transform: "translateX(0) skew(-10deg)",
            transformOrigin: "100% 50%",
          }}
        >
          <div className="transform skew-x-[10deg] origin-top-right">
            <div className="space-y-4 pt-6">
              <div className="px-4">
                <h2 className="text-lg font-heading font-bold text-primary">
                  {user?.email || "My Account"}
                </h2>
              </div>
              <nav className="space-y-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary/10 transition-colors rounded-md group"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-4 w-4 text-primary group-hover:animate-pulse" />
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary/10 transition-colors rounded-md group"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-4 w-4 text-primary group-hover:animate-pulse" />
                  Settings
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary/10 transition-colors rounded-md group"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4 text-primary group-hover:animate-pulse" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-red-500/10 text-red-500 transition-colors rounded-md group"
                >
                  <LogOut className="h-4 w-4 group-hover:animate-pulse" />
                  {isLoading ? "Logging out..." : "Log out"}
                </button>
              </nav>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Render login form if not logged in
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
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