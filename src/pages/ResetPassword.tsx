
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const logger = useLogger('ResetPasswordPage', { category: 'AUTH' });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [isRequestingReset, setIsRequestingReset] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);
  
  // Check for token from email link
  const resetToken = searchParams.get('token');
  
  useEffect(() => {
    if (resetToken) {
      logger.info('Reset token found in URL');
    }
  }, [resetToken, logger]);
  
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsRequestingReset(true);
    
    try {
      logger.info('Requesting password reset', {
        details: { email }
      });
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;
      
      logger.info('Password reset email sent');
      
      setResetRequested(true);
      toast({
        title: 'Reset Email Sent',
        description: 'Check your email for a password reset link.',
      });
    } catch (error: any) {
      logger.error('Error requesting password reset', {
        details: { error: error.message }
      });
      
      toast({
        title: 'Reset Request Failed',
        description: error.message || 'There was an error requesting a password reset. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRequestingReset(false);
    }
  };
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords Do Not Match',
        description: 'Please make sure your passwords match.',
        variant: 'destructive',
      });
      return;
    }
    
    if (password.length < 8) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 8 characters long.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsResetting(true);
    
    try {
      logger.info('Resetting password');
      
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      logger.info('Password reset successful');
      
      toast({
        title: 'Password Reset Successful',
        description: 'Your password has been reset. You can now log in with your new password.',
      });
      
      // Redirect to login page after successful reset
      navigate('/login');
    } catch (error: any) {
      logger.error('Error resetting password', {
        details: { error: error.message }
      });
      
      toast({
        title: 'Reset Failed',
        description: error.message || 'There was an error resetting your password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsResetting(false);
    }
  };
  
  // Show password reset form if token is present
  if (resetToken) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-10">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Reset Your Password</CardTitle>
              <CardDescription className="text-center">
                Enter your new password below
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isResetting}>
                  {isResetting ? 'Resetting Password...' : 'Reset Password'}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="text-sm text-center">
              <Link to="/login" className="text-primary underline hover:text-primary/80">
                Back to Login
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  // Show request reset form if no token and reset not yet requested
  if (!resetRequested) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-10">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Forgot Password?</CardTitle>
              <CardDescription className="text-center">
                Enter your email to receive a password reset link
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isRequestingReset}>
                  {isRequestingReset ? 'Sending Reset Link...' : 'Send Reset Link'}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="text-sm text-center">
              <Link to="/login" className="text-primary underline hover:text-primary/80">
                Back to Login
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  // Show confirmation message after reset request
  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Check Your Email</CardTitle>
            <CardDescription className="text-center">
              We've sent a password reset link to {email}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Click the link in the email to reset your password. If you don't see the email, check your spam folder.
            </p>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button variant="outline" onClick={handleRequestReset} disabled={isRequestingReset}>
              {isRequestingReset ? 'Sending...' : 'Resend Email'}
            </Button>
            
            <div className="text-sm text-center">
              <Link to="/login" className="text-primary underline hover:text-primary/80">
                Back to Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
