import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { Link as LinkIcon, X } from 'lucide-react';
import { AuthBridge, subscribeToAuthEvents } from '@/auth/bridge';
import { useToast } from '@/hooks/use-toast';

export function LinkedAccountAlert() {
  const [show, setShow] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);
  const [linking, setLinking] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Listen for AUTH_LINKING_REQUIRED events
    const unsubscribe = subscribeToAuthEvents((event) => {
      if (event.type === 'AUTH_LINKING_REQUIRED' && event.payload?.provider) {
        setProvider(event.payload.provider);
        setShow(true);
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  // Don't render anything if not showing
  if (!show || !provider) return null;
  
  const handleLink = async () => {
    try {
      setLinking(true);
      
      if (provider === 'google') {
        await AuthBridge.linkSocialAccount('google');
        
        toast({
          title: 'Account linked successfully',
          description: 'You can now sign in with either method',
        });
        
        setShow(false);
      }
    } catch (error) {
      toast({
        title: 'Failed to link account',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLinking(false);
    }
  };
  
  return (
    <Alert className="fixed bottom-4 left-4 w-80 z-50 shadow-lg animate-in fade-in slide-in-from-bottom-10 duration-300">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <AlertTitle className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Link your accounts
          </AlertTitle>
          <AlertDescription className="mt-2">
            {provider === 'google' ? (
              <div className="space-y-2">
                <p>Link your Google account for easier sign in</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLink}
                  disabled={linking}
                  className="flex items-center gap-2 w-full"
                >
                  <FcGoogle className="h-4 w-4" />
                  {linking ? 'Linking...' : 'Link Google Account'}
                </Button>
              </div>
            ) : (
              <p>Link your accounts for easier sign in</p>
            )}
          </AlertDescription>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0" 
          onClick={() => setShow(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}
