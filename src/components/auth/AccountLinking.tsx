
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Mail, UserCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/auth/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { safeDetails } from '@/logging/utils/safeDetails';

export function AccountLinking() {
  const [isGithubLinking, setIsGithubLinking] = useState(false);
  const [isGoogleLinking, setIsGoogleLinking] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const logger = useLogger('AccountLinking', LogCategory.AUTH);

  // Get current auth provider for the user
  const currentProvider = user?.app_metadata?.provider;
  
  // Check if user already has linked accounts
  const hasGithubLink = user?.identities?.some(identity => identity.provider === 'github');
  const hasGoogleLink = user?.identities?.some(identity => identity.provider === 'google');

  const handleLinkGithub = async () => {
    try {
      setIsGithubLinking(true);
      logger.info('Starting GitHub account linking');
      
      // Use linking=true in the query to handle linking flow in callback
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?linking=true`,
        }
      });
      
      if (error) throw error;
      
      // Redirect to auth provider
      if (data.url) {
        logger.info('Redirecting to GitHub OAuth');
        window.location.href = data.url;
      }
    } catch (error) {
      logger.error('Error linking GitHub account', { details: safeDetails(error) });
      toast({
        title: "Account linking failed",
        description: "Could not initiate GitHub account linking",
        variant: "destructive"
      });
    } finally {
      setIsGithubLinking(false);
    }
  };

  const handleLinkGoogle = async () => {
    try {
      setIsGoogleLinking(true);
      logger.info('Starting Google account linking');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?linking=true`,
        }
      });
      
      if (error) throw error;
      
      // Redirect to auth provider
      if (data.url) {
        logger.info('Redirecting to Google OAuth');
        window.location.href = data.url;
      }
    } catch (error) {
      logger.error('Error linking Google account', { details: safeDetails(error) });
      toast({
        title: "Account linking failed",
        description: "Could not initiate Google account linking",
        variant: "destructive"
      });
    } finally {
      setIsGoogleLinking(false);
    }
  };

  return (
    <Card className="max-w-md w-full border-primary/20 bg-card/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-foreground flex items-center gap-2">
          <UserCircle2 className="w-5 h-5 text-primary" />
          <span>Account Linking</span>
        </CardTitle>
        <CardDescription>
          Link multiple authentication methods to your account for easier access
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 border border-border rounded-md">
          <div className="flex items-center gap-3">
            <Github className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">GitHub</p>
              <p className="text-xs text-muted-foreground">
                {hasGithubLink 
                  ? "GitHub account linked" 
                  : "Connect your GitHub account"
                }
              </p>
            </div>
          </div>
          
          <Button 
            variant={hasGithubLink ? "outline" : "default"} 
            size="sm"
            onClick={handleLinkGithub}
            disabled={isGithubLinking || hasGithubLink || currentProvider === 'github'}
          >
            {hasGithubLink ? "Linked" : "Link"}
          </Button>
        </div>
        
        <div className="flex items-center justify-between p-3 border border-border rounded-md">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Google</p>
              <p className="text-xs text-muted-foreground">
                {hasGoogleLink 
                  ? "Google account linked" 
                  : "Connect your Google account"
                }
              </p>
            </div>
          </div>
          
          <Button 
            variant={hasGoogleLink ? "outline" : "default"} 
            size="sm"
            onClick={handleLinkGoogle}
            disabled={isGoogleLinking || hasGoogleLink || currentProvider === 'google'}
          >
            {hasGoogleLink ? "Linked" : "Link"}
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Currently signed in with: <span className="font-medium">{currentProvider || 'email'}</span>
        </p>
      </CardFooter>
    </Card>
  );
}
