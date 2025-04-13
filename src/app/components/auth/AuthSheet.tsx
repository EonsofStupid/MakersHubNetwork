
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useToast } from '@/shared/ui/use-toast';
import { Shield } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { motion } from 'framer-motion';
import { authBridge } from '@/auth/bridge';
import { RBACBridge } from '@/rbac/bridge';
import { useNavigate } from 'react-router-dom';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory, LogLevel } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

type AuthMode = 'login' | 'signup';

export function AuthSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const loggingContext = useLogger("AuthSheet", LogCategory.AUTH);

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await authBridge.signInWithEmail(email, password);
      
      if (result.error) {
        throw result.error;
      }
      
      // Log the roles that were assigned during login
      const roles = RBACBridge.getRoles();
      logger.log(LogLevel.INFO, LogCategory.AUTH, "Login successful", { 
        source: "AuthSheet", 
        details: { email, roles } 
      });
      
      toast({
        title: "Success",
        description: "You have successfully logged in.",
      });
      
      setIsOpen(false);
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, "Login failed", {
        source: "AuthSheet",
        details: { email, error }
      });
      
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await authBridge.signUp(email, password);
      
      if (result.error) {
        throw result.error;
      }
      
      toast({
        title: "Success",
        description: "Your account has been created.",
      });
      
      // Log the assigned role
      const roles = RBACBridge.getRoles();
      logger.log(LogLevel.INFO, LogCategory.AUTH, "Signup successful", {
        source: "AuthSheet",
        details: { email, roles }
      });
      
      setMode('login');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, "Signup failed", {
        source: "AuthSheet",
        details: { error }
      });
      
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "An error occurred during signup",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminClick = () => {
    setIsOpen(false);
    navigate('/admin');
    logger.log(LogLevel.INFO, LogCategory.AUTH, "Navigating to admin dashboard", { 
      source: "AuthSheet" 
    });
  };

  const hasAdminAccess = RBACBridge.hasAdminAccess();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          {mode === 'login' ? 'Sign In' : 'Sign Up'}
        </Button>
      </SheetTrigger>

      <SheetContent
        className={cn(
          'sm:max-w-sm backdrop-blur-xl bg-background/80 border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)] transform-gpu',
          'before:content-[\'\'] before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-secondary/5 before:pointer-events-none'
        )}
        style={{
          clipPath: 'polygon(20px 0, 100% 0, 100% 100%, 0 100%)',
          transform: 'translateX(0) skew(-10deg)',
          transformOrigin: '100% 50%',
        }}
      >
        <motion.div
          className="transform skew-x-[10deg] origin-top-right"
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <SheetHeader>
            <SheetTitle>{mode === 'login' ? 'Sign In' : 'Sign Up'}</SheetTitle>
            <SheetDescription>
              {mode === 'login' 
                ? 'Enter your credentials or create a new account.' 
                : 'Create a new account to get started.'}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-4 py-4">
            {mode === 'login' ? (
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
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
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

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </form>
            )}

            <div className="text-center mt-4">
              <Button variant="link" type="button" onClick={toggleMode}>
                {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </div>

            {mode === 'login' && hasAdminAccess && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  className={cn(
                    'w-full bg-primary/5 hover:bg-primary/10',
                    'group relative overflow-hidden'
                  )}
                  onClick={handleAdminClick}
                >
                  <Shield className="mr-2 h-4 w-4 text-primary" />
                  <span className="text-primary">Admin Dashboard</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
