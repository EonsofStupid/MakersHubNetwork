
import React, { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { X } from 'lucide-react';
import { authBridge, subscribeToAuthEvents } from '@/auth/bridge';
import { useToast } from '@/shared/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { AuthEventType } from '@/shared/types/shared.types';

export function AccountLinkingModal() {
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);
  const [linking, setLinking] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Listen for AUTH_LINKING_REQUIRED events
    const unsubscribe = subscribeToAuthEvents((event) => {
      if (event.type === 'AUTH_LINKING_REQUIRED' && event.payload?.provider) {
        setProvider(event.payload.provider);
        setOpen(true);
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  // Don't render anything if not showing
  if (!provider) return null;
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleLink = async () => {
    try {
      setLinking(true);
      
      if (provider === 'google') {
        await authBridge.linkSocialAccount('google');
        
        toast({
          title: 'Account linked successfully',
          description: 'You can now sign in with either method',
        });
        
        setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Link your accounts</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Linking your accounts allows you to sign in using multiple methods.
          </p>
          {provider === 'google' && (
            <Button 
              variant="outline" 
              onClick={handleLink}
              disabled={linking}
              className="flex items-center gap-2 w-full"
            >
              <FcGoogle className="h-4 w-4" />
              {linking ? 'Linking...' : 'Link Google Account'}
            </Button>
          )}
          <Button 
            variant="ghost" 
            className="w-full" 
            onClick={handleClose}
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
