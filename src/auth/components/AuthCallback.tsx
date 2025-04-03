
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useToast } from '@/hooks/use-toast';
import { safeDetails } from '@/logging/utils/safeDetails';
import { Loader2 } from 'lucide-react';

export function AuthCallback() {
  const [isProcessing, setIsProcessing] = useState(true);
  const navigate = useNavigate();
  const logger = useLogger('AuthCallback', LogCategory.AUTH);
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        logger.info('Auth callback handling started');
        
        const url = new URL(window.location.href);
        const isLinking = url.searchParams.get('linking') === 'true';
        
        if (isLinking) {
          // Account linking flow
          logger.info('Processing account linking callback');
          
          // The actual linking is handled by Supabase automatically
          // We just need to show a success message and redirect
          
          toast({
            title: "Account linked",
            description: "Your account was successfully linked",
          });
          
          // Navigate back to profile
          navigate('/profile');
        } else {
          // Regular auth flow - just go to homepage
          logger.info('Processing standard auth callback');
          navigate('/');
        }
      } catch (error) {
        logger.error('Error handling auth callback', { details: safeDetails(error) });
        toast({
          title: "Authentication error",
          description: "There was an issue processing your login",
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [navigate, logger, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-heading text-primary mb-2">Processing Authentication</h2>
        <p className="text-muted-foreground">Please wait while we complete the process...</p>
      </div>
    </div>
  );
}
