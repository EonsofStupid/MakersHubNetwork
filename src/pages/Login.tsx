import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
import { useAuth } from "@/hooks/useAuth";
import { useAdminAccess } from "@/admin/hooks/useAdminAccess";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/logging";

interface LoginProps {
  onSuccess?: () => void;
}

const Login = ({ onSuccess }: LoginProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { hasAdminAccess } = useAdminAccess();
  const logger = useLogger("LoginPage", LogCategory.AUTH);
  
  const from = new URLSearchParams(location.search).get("from") || "/";

  useEffect(() => {
    if (isAuthenticated) {
      logger.info("User authenticated, redirecting", { details: { redirectTo: from } });
      onSuccess?.();
      
      // Check if user was trying to access admin section or has admin access
      const goingToAdmin = from.includes("/admin");
      
      if (goingToAdmin) {
        if (hasAdminAccess) {
          logger.info("User has admin access, redirecting to admin");
          toast({
            title: "Admin Access",
            description: "Welcome to the admin dashboard",
          });
          navigate("/admin"); 
        } else {
          logger.info("User lacks admin access, redirecting to home");
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin section",
            variant: "destructive"
          });
          navigate("/");
        }
      } else if (from === "/login" && hasAdminAccess) {
        // If coming directly to login page and has admin access, suggest admin
        logger.info("User has admin access, suggesting admin panel");
        toast({
          title: "Admin Access Available",
          description: "You can access the admin dashboard",
        });
        navigate("/"); 
      } else {
        // Normal redirect to requested page
        logger.info("Standard redirect after login");
        navigate(from);
      }
    }
  }, [isAuthenticated, navigate, onSuccess, hasAdminAccess, from, toast, logger]);

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-heading text-primary">
            Welcome Back
          </CardTitle>
          <CardDescription>Sign in to access your account</CardDescription>
        </CardHeader>

        <CardContent>
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
                button: 'auth-button',
                input: 'auth-input',
                divider: 'auth-divider',
                anchor: 'auth-anchor text-primary hover:text-primary/80',
              },
              style: {
                button: {
                  padding: '8px 12px',
                  borderRadius: '8px',
                },
              },
            }}
            theme="dark"
            providers={["github", "google"]}
            redirectTo={window.location.origin}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
