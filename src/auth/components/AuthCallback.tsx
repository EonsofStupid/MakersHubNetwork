
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
  const logger = useLogger('AuthCallback', { category: LogCategory.AUTH });
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
          
          // Navigate back to the link account page
          navigate('/link-account');
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
    <div className="flex items-center justify-center min-h-screen bg-background/80 backdrop-blur-xl">
      <div className="relative text-center p-8 border border-primary/20 rounded-lg shadow-[0_0_30px_rgba(0,240,255,0.15)] bg-background/50">
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-grid-small-primary/10 [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
        </div>
        
        <div className="relative">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-heading text-primary mb-2">Processing Authentication</h2>
          <p className="text-muted-foreground">Please wait while we complete the process...</p>
          
          <div className="h-1 w-full bg-muted/20 rounded-full mt-6 overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse-slow"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
