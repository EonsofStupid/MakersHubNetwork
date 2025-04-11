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
  cyberpunk?: boolean;
}

export function GoogleLoginButton({
  className,
  onSuccess,
  onError,
  fullWidth = false,
  variant = 'outline',
  cyberpunk = false
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
  
  if (cyberpunk) {
    return (
      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className={cn(
          'relative w-full flex items-center justify-center gap-2 border border-primary/30 bg-background/80 text-primary',
          'hover:border-primary hover:bg-primary/10 hover:text-white transition-all',
          'py-2 px-4 rounded overflow-hidden group cyber-effect-text',
          fullWidth ? 'w-full' : 'w-auto',
          className
        )}
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
        <FcGoogle className="h-5 w-5" />
        <span>{isLoading ? 'Connecting...' : 'Sign in with Google'}</span>
      </button>
    );
  }
  
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
