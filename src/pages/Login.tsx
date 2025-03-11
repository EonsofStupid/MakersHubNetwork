import { useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useAuthStore } from '@/stores/auth/store';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const status = useAuthStore((state) => state.status);
  const isAuthenticated = status === 'authenticated';
  
  // Get redirect path from search params
  const { redirect = '/' } = useSearch({ from: '/login' });

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: redirect as string });
    }
  }, [isAuthenticated, navigate, redirect]);

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
            providers={['github', 'google']}
            redirectTo={window.location.origin}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
