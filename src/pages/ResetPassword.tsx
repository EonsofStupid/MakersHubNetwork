
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';
import { Link } from 'react-router-dom';

// Simple layout since AuthLayout is not available
const SimpleLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen items-center justify-center p-4 bg-background">
    {children}
  </div>
);

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const logger = useLogger('ResetPassword', { category: LogCategory.AUTHENTICATION });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: 'Missing email',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsLoading(true);
      logger.info('Reset password request initiated', { details: { email } });
      
      // Use updateUser method from Supabase Auth
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/update-password',
      });
      
      if (error) {
        throw error;
      }
      
      logger.info('Password reset email sent successfully');
      setIsSuccess(true);
      toast({
        title: 'Email Sent',
        description: 'Check your email for a password reset link.',
      });
    } catch (error: any) {
      logger.error('Failed to send password reset email', {
        details: { error: error.message }
      });
      toast({
        title: 'Error',
        description: error.message || 'Failed to send password reset email.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SimpleLayout>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            {isSuccess 
              ? 'We sent you an email with a link to reset your password.' 
              : 'Enter your email address and we\'ll send you a link to reset your password.'}
          </CardDescription>
        </CardHeader>
        
        {!isSuccess ? (
          <>
            <form onSubmit={handleSubmit}>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex flex-col w-full gap-4">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                  </Button>
                  <Link 
                    to="/login" 
                    className="text-center text-sm text-muted-foreground hover:underline"
                  >
                    Back to Login
                  </Link>
                </div>
              </CardFooter>
            </form>
          </>
        ) : (
          <CardContent>
            <div className="flex flex-col items-center justify-center gap-4 py-6">
              <div className="rounded-full bg-primary/20 p-3">
                <CheckCircleIcon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-center text-muted-foreground">
                Check your inbox for the password reset link. If you don't see it, check your spam folder.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                asChild
              >
                <Link to="/login">Back to Login</Link>
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </SimpleLayout>
  );
}

// CheckCircleIcon component
function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
