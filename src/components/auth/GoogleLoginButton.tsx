
import React from 'react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { AuthBridge } from '@/auth/bridge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface GoogleLoginButtonProps {
  className?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  fullWidth?: boolean;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
}

export function GoogleLoginButton({
  className,
  onSuccess,
  onError,
  fullWidth = false,
  variant = 'outline'
}: GoogleLoginButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await AuthBridge.signInWithGoogle();
      onSuccess?.();
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: 'Authentication Failed',
        description: error instanceof Error ? error.message : 'Failed to sign in with Google',
        variant: 'destructive'
      });
      onError?.(error instanceof Error ? error : new Error('Google login failed'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button
      variant={variant}
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className={cn(
        'flex items-center gap-2',
        fullWidth && 'w-full',
        className
      )}
    >
      <FcGoogle className="h-5 w-5" />
      {isLoading ? 'Connecting...' : 'Sign in with Google'}
    </Button>
  );
}

export default GoogleLoginButton;
