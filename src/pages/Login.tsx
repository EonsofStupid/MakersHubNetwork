import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

const Login = () => {
  // For navigation after login, if needed
  const navigate = useNavigate();
  const { toast } = useToast();

  // No direct supabase.auth.onAuthStateChange here;
  // AuthProvider already handles it.

  return (
    <Card className="max-w-md mx-auto">
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
            },
          }}
          theme="dark"
          providers={["google", "github"]}
          // If you want Supabase to handle the redirect, set this:
          redirectTo={window.location.origin}
        />
      </CardContent>
    </Card>
  );
};

export default Login;
