
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GithubIcon, GoogleIcon, TwitterIcon } from 'lucide-react';
import { useAuthStore } from '@/stores/auth/store';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';

export function AccountLinking() {
  const { user } = useAuthStore();
  const [linkedAccounts, setLinkedAccounts] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const logger = useLogger('AccountLinking', { category: LogCategory.AUTHENTICATION });
  
  useEffect(() => {
    // Load linked accounts when the component mounts
    async function loadLinkedAccounts() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        const identities = user.identities || [];
        const providerNames = identities.map(identity => identity.provider);
        
        setLinkedAccounts(providerNames);
      } catch (error) {
        logger.error('Error loading linked accounts', { details: error });
      }
    }
    
    loadLinkedAccounts();
  }, [user, logger]);
  
  const handleLinkProvider = async (provider: string) => {
    if (!user) return;
    
    setLoading(true);
    logger.info(`Initiating account linking with ${provider}`);
    
    try {
      // Redirect to auth flow with provider
      navigate(`/link-account?provider=${provider}`);
    } catch (error) {
      logger.error(`Error linking ${provider} account`, { details: error });
      setLoading(false);
    }
  };
  
  const handleUnlinkProvider = async (provider: string) => {
    if (!user) return;
    
    setLoading(true);
    logger.info(`Unlinking ${provider} account`);
    
    try {
      const { error } = await supabase.auth.unlinkIdentity(provider);
      
      if (error) throw error;
      
      // Update linked accounts list
      setLinkedAccounts(current => current.filter(p => p !== provider));
      logger.info(`Successfully unlinked ${provider} account`);
    } catch (error) {
      logger.error(`Error unlinking ${provider} account`, { details: error });
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-sm text-muted-foreground">
            Please log in to manage your linked accounts
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Linked Accounts</CardTitle>
        <CardDescription>Connect your accounts for easier login</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {/* GitHub */}
          <div className="flex items-center justify-between p-4 border rounded-md">
            <div className="flex items-center gap-3">
              <GithubIcon className="h-6 w-6" />
              <span>GitHub</span>
            </div>
            <Button
              variant={linkedAccounts.includes('github') ? 'destructive' : 'outline'}
              size="sm"
              disabled={loading}
              onClick={() => linkedAccounts.includes('github') 
                ? handleUnlinkProvider('github')
                : handleLinkProvider('github')
              }
            >
              {linkedAccounts.includes('github') ? 'Unlink' : 'Link'}
            </Button>
          </div>
          
          {/* Google */}
          <div className="flex items-center justify-between p-4 border rounded-md">
            <div className="flex items-center gap-3">
              <GoogleIcon className="h-6 w-6" />
              <span>Google</span>
            </div>
            <Button
              variant={linkedAccounts.includes('google') ? 'destructive' : 'outline'}
              size="sm"
              disabled={loading}
              onClick={() => linkedAccounts.includes('google')
                ? handleUnlinkProvider('google')
                : handleLinkProvider('google')
              }
            >
              {linkedAccounts.includes('google') ? 'Unlink' : 'Link'}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          {linkedAccounts.length > 0
            ? `You have ${linkedAccounts.length} linked account(s)`
            : 'No accounts linked yet'}
        </p>
      </CardFooter>
    </Card>
  );
}
