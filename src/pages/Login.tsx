
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { GoogleLoginButton } from '@/auth/components/GoogleLoginButton';
import { authBridge } from '@/auth/bridge';
import { useToast } from '@/shared/hooks/use-toast';
import { useAuthStore } from '@/auth/store/auth.store';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const logger = useLogger('LoginPage', LogCategory.AUTH);
  
  // Get auth status directly from store
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await authBridge.signIn(email, password);
      toast({
        title: 'Success',
        description: 'You have successfully logged in.',
      });
      navigate('/');
    } catch (error) {
      logger.error('Login failed', { details: { error } });
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'An error occurred during login',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-background/20 backdrop-blur-xl border-primary/30">
        <CardHeader>
          <CardTitle className="text-2xl font-heading font-bold text-primary">Sign In</CardTitle>
          <CardDescription>Enter your credentials or use a social provider to sign in.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                disabled={loading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-primary/30" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">or continue with</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <GoogleLoginButton />
            
            <Button variant="outline" className="w-full" disabled>
              <svg viewBox="0 0 24 24" className="h-4 w-4 mr-2">
                <path
                  fill="currentColor"
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
              GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/signup')}>
              Sign up
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
