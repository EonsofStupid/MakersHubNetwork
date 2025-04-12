
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { User, Mail, Key } from 'lucide-react';
import { authBridge } from '@/auth/bridge';
import { useToast } from '@/shared/hooks/use-toast';
import { AuthEventType } from '@/shared/types/shared.types';

export function AccountLinkingModal() {
  const [open, setOpen] = useState(false);
  const [linking, setLinking] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Listen for AUTH_LINKING_REQUIRED events
    const unsubscribe = authBridge.onAuthEvent((event) => {
      if (event.type === 'AUTH_LINKING_REQUIRED') {
        // Only show if we have email and provider
        if (event.payload?.email && event.payload?.provider) {
          setEmail(event.payload.email);
          setProvider(event.payload.provider);
          setOpen(true);
        }
      }
    });
    
    return () => unsubscribe();
  }, []);

  const handleLinkAccount = async () => {
    if (!provider) return;
    
    try {
      setLinking(true);
      
      // Link the account
      if (provider === 'google') {
        await authBridge.linkAccount('google');
      }
      
      toast({
        title: 'Accounts linked successfully',
        description: 'You can now sign in with either method',
      });
      
      // Close the modal
      setOpen(false);
    } catch (error) {
      toast({
        title: 'Failed to link accounts',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLinking(false);
    }
  };
  
  // Determine provider icon
  const ProviderIcon = () => {
    switch (provider) {
      case 'google':
        return <FcGoogle className="h-6 w-6" />;
      default:
        return <User className="h-6 w-6" />;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Link your accounts</DialogTitle>
          <DialogDescription className="text-center">
            We found an existing account with the same email
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="rounded-full bg-muted p-3">
              <Mail className="h-6 w-6" />
            </div>
            <p className="text-sm text-center text-muted-foreground">
              {email}
            </p>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-muted p-3">
                <Key className="h-6 w-6" />
              </div>
              <p className="text-xs mt-2">Password</p>
            </div>
            
            <div className="h-px w-12 bg-border mx-4" />
            
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-muted p-3">
                <ProviderIcon />
              </div>
              <p className="text-xs mt-2 capitalize">{provider}</p>
            </div>
          </div>
          
          <p className="text-center text-sm">
            Would you like to link these accounts so you can sign in using either method?
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1"
          >
            No, thanks
          </Button>
          <Button
            variant="default"
            onClick={handleLinkAccount}
            disabled={linking}
            className="flex-1"
          >
            {linking ? 'Linking...' : 'Link accounts'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
