import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

interface LoginProps {
  onSuccess?: () => void;
}

const Login = ({ onSuccess }: LoginProps) => {
  const navigate = useNavigate();

  return (
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
          providers={['google', 'github']}
          redirectTo={window.location.origin}
        />
      </CardContent>
    </div>
  );
};

export default Login;