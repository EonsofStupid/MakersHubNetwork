
import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useToast } from '@/shared/ui/use-toast';
import { useState, useEffect } from 'react';
import { authBridge } from '@/auth/bridge';
import { GoogleLoginButton } from '@/auth/components/GoogleLoginButton';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { UserRole } from '@/shared/types/shared.types';
import { useAuthStore } from '@/auth/store/auth.store';

export function LoginSheet() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const { toast } = useToast();
  const logger = useLogger('LoginSheet', LogCategory.AUTH);
  const navigate = useNavigate();
  
  // Get auth state from store
  const { user, roles } = useAuthStore();
  const isAuthenticated = !!user;
  
  // Check for admin access
  useEffect(() => {
    if (isAuthenticated && roles) {
      const isAdmin = roles.some(role => 
        role === UserRole.ADMIN || 
        role === UserRole.SUPER_ADMIN
      );
      setHasAdminAccess(isAdmin);
    } else {
      setHasAdminAccess(false);
    }
  }, [isAuthenticated, roles]);
  
  // If already authenticated, don't show the login button
  if (isAuthenticated) return null;
  
  const handleSubmit = async (e: React.FormEvent) => {
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
      await authBridge.signInWithEmail(email, password);
      toast({
        title: 'Success',
        description: 'You have successfully logged in.',
      });
      setIsOpen(false);
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

  const handleAdminClick = () => {
    setIsOpen(false);
    navigate("/admin");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Sign In
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-sm trapezoid-sheet">
        <div className="sheet-accent" aria-hidden="true" />
        <SheetHeader>
          <SheetTitle>Sign In</SheetTitle>
          <SheetDescription>
            Enter your credentials or use a social provider to sign in.
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
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

          {hasAdminAccess && (
            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full bg-primary/5 hover:bg-primary/10"
                onClick={handleAdminClick}
              >
                <Shield className="mr-2 h-4 w-4 text-primary" />
                <span className="text-primary">Admin Dashboard</span>
              </Button>
            </div>
          )}
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <GoogleLoginButton
            fullWidth
            variant="outline"
            onSuccess={() => {
              setIsOpen(false);
              toast({
                title: 'Success',
                description: 'You have successfully logged in with Google.',
              });
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
