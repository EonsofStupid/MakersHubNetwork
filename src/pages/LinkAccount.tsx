
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/constants/logLevel';
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || '';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export default function LinkAccount() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const provider = searchParams.get('provider');
  const { toast } = useToast();
  const logger = useLogger('LinkAccount', { category: LogCategory.AUTH });
  const [isLoading, setIsLoading] = useState(true);

  const linkExternalAccount = async (provider: string) => {
    try {
      logger.info(`Linking account with ${provider}`);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?linking=true`,
        }
      });
      
      if (error) throw error;
      return true;
    } catch (error) {
      logger.error(`Failed to link account with ${provider}`, { 
        details: error 
      });
      return false;
    }
  };

  useEffect(() => {
    if (!provider) {
      logger.warn('Provider missing from query parameters');
      toast({
        title: 'Provider Missing',
        description: 'No provider was specified in the URL.',
        variant: 'destructive',
      });
      navigate('/settings/profile');
      return;
    }

    const linkAccount = async () => {
      logger.info(`Attempting to link account with provider: ${provider}`);
      setIsLoading(true);
      const success = await linkExternalAccount(provider);

      if (success) {
        logger.info(`Successfully linked account with provider: ${provider}`);
        toast({
          title: 'Account Linked',
          description: `Successfully linked your account with ${provider}.`,
        });
      } else {
        logger.error(`Failed to link account with provider: ${provider}`);
        toast({
          title: 'Link Failed',
          description: `Failed to link account with ${provider}`,
          variant: 'destructive',
        });
      }
      setIsLoading(false);
      navigate('/settings/profile');
    };

    if (auth.user) {
      linkAccount();
    } else {
      logger.warn('User not authenticated, redirecting to home page.');
      navigate('/');
    }
  }, [provider, navigate, toast, auth.user, logger]);

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Linking Account...</CardTitle>
          <CardDescription>Please wait while we link your account.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          {isLoading ? (
            <span className="loading loading-dots loading-lg"></span>
          ) : (
            <Button variant="outline" disabled>
              Redirecting...
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
