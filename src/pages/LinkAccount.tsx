
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Github, Mail, LinkIcon, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/auth/hooks/useAuth';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LinkAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const logger = useLogger('LinkAccount', LogCategory.AUTH);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      logger.info('Unauthenticated user attempted to access link account page');
      toast({
        title: 'Authentication required',
        description: 'Please login to link your accounts',
        variant: 'destructive',
      });
      navigate('/login?from=/link-account');
    }
  }, [isAuthenticated, navigate, toast, logger]);

  const linkProvider = async (provider: 'github' | 'google') => {
    try {
      setIsLoading(true);
      logger.info(`Initiating account linking flow for ${provider}`);

      // Configure the redirect URL with special parameter to indicate linking
      const redirectTo = `${window.location.origin}/auth/callback?linking=true`;
      
      if (provider === 'github') {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo,
            scopes: 'user:email',
          },
        });
        if (error) throw error;
      } else if (provider === 'google') {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo,
            scopes: 'email profile',
          },
        });
        if (error) throw error;
      }
    } catch (error) {
      logger.error('Error initiating account linking', { 
        details: { error, provider } 
      });
      
      toast({
        title: 'Failed to initiate linking',
        description: 'There was a problem starting the account linking process',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const getConnectedProviders = () => {
    if (!user || !user.identities) return [];
    return user.identities.map(identity => identity.provider);
  };

  const connectedProviders = getConnectedProviders();
  const currentProvider = user?.app_metadata?.provider;

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md backdrop-blur-xl bg-background/80 border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
        <CardHeader>
          <CardTitle className="text-2xl font-heading text-primary flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Link Your Accounts
          </CardTitle>
          <CardDescription>
            Connect multiple login methods to your MakersImpulse account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-muted/30 rounded-md border border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Currently signed in as:</span> {user?.email}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Primary login method: <span className="font-mono">{currentProvider}</span>
            </p>
          </div>

          <Tabs defaultValue="link" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="link">Link New</TabsTrigger>
              <TabsTrigger value="manage">Manage Links</TabsTrigger>
            </TabsList>
            
            <TabsContent value="link" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 h-10 bg-muted/20 hover:bg-muted/30 border-primary/20"
                  onClick={() => linkProvider('github')}
                  disabled={isLoading || connectedProviders.includes('github')}
                >
                  <Github className="h-4 w-4" />
                  {connectedProviders.includes('github') ? 'Already Linked' : 'Link GitHub Account'}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 h-10 bg-muted/20 hover:bg-muted/30 border-primary/20"
                  onClick={() => linkProvider('google')}
                  disabled={isLoading || connectedProviders.includes('google')}
                >
                  <Mail className="h-4 w-4" />
                  {connectedProviders.includes('google') ? 'Already Linked' : 'Link Google Account'}
                </Button>
              </div>
              
              <div className="rounded-md bg-amber-500/10 p-3 text-sm border border-amber-500/30">
                <div className="flex gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <div className="text-amber-100">
                    <p className="font-medium">Important Note</p>
                    <p className="text-xs mt-1">
                      Linking accounts allows you to sign in using different methods. All accounts must share the same email address.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="manage" className="pt-4">
              <div className="space-y-4">
                {connectedProviders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No linked accounts yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {connectedProviders.includes('github') && (
                      <div className="flex items-center justify-between p-3 border border-primary/20 rounded-md">
                        <div className="flex items-center gap-2">
                          <Github className="h-4 w-4" />
                          <span>GitHub</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Connected</span>
                      </div>
                    )}
                    
                    {connectedProviders.includes('google') && (
                      <div className="flex items-center justify-between p-3 border border-primary/20 rounded-md">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>Google</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Connected</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="rounded-md bg-muted/30 p-3 text-sm">
                  <p className="text-xs text-muted-foreground">
                    For security reasons, you cannot remove your primary login method. To change your primary method, contact support.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-4">
            <Button 
              variant="secondary" 
              onClick={() => navigate(-1)}
            >
              Return
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkAccount;
