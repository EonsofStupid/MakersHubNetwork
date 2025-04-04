
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { formatLogDetails } from '@/logging/utils/details-formatter';
import { useAuth } from '@/auth/hooks/useAuth';
import { Github, Mail, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Component for linking multiple authentication methods to a user account
 */
export function AccountLinking() {
  const [linkedProviders, setLinkedProviders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const logger = useLogger('AccountLinking', { category: LogCategory.AUTH });

  // Fetch linked providers on mount
  useEffect(() => {
    const fetchLinkedProviders = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        logger.info('Fetching linked providers');

        // This is a mock implementation - in a real app, you would fetch from your backend
        const { data, error } = await supabase
          .from('user_identities')
          .select('provider')
          .eq('user_id', user.id);

        if (error) throw error;

        // Extract provider names from the results
        const providers = data.map(identity => identity.provider);
        setLinkedProviders(providers);
        
        logger.info('Linked providers fetched successfully', {
          details: { providers }
        });
      } catch (error) {
        logger.error('Error fetching linked providers', {
          details: formatLogDetails(error)
        });
        
        toast({
          title: "Error",
          description: "Failed to load linked accounts",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinkedProviders();
  }, [user, toast, logger]);

  // Handle linking a new provider
  const handleLinkProvider = async (provider: string) => {
    try {
      logger.info(`Initiating account linking for ${provider}`);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?linking=true`,
        }
      });
      
      if (error) throw error;
      
      // The user will be redirected to the OAuth provider
      logger.info('Redirecting to provider for authentication');
    } catch (error) {
      logger.error(`Error linking ${provider} account`, {
        details: formatLogDetails(error)
      });
      
      toast({
        title: "Error",
        description: `Failed to link ${provider} account`,
        variant: "destructive"
      });
    }
  };

  // Check if a provider is already linked
  const isProviderLinked = (provider: string): boolean => {
    return linkedProviders.includes(provider);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Link Accounts</CardTitle>
          <CardDescription>
            Connect multiple accounts to enable seamless sign-in
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Link Accounts</CardTitle>
        <CardDescription>
          Connect multiple accounts to enable seamless sign-in
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5" />
              <span>Email & Password</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={true}
            >
              Primary
            </Button>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Github className="h-5 w-5" />
              <span>GitHub</span>
            </div>
            {isProviderLinked('github') ? (
              <Button 
                variant="outline" 
                size="sm" 
                disabled={true}
              >
                Linked
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleLinkProvider('github')}
              >
                Link
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Linking accounts allows you to sign in using any of your connected providers.
        </p>
      </CardFooter>
    </Card>
  );
}
