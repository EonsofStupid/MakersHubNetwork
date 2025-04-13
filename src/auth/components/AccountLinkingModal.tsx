
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Github, Google, Twitter } from 'lucide-react';
import { useToast } from '@/shared/ui/use-toast';
import { authBridge } from '@/auth/bridge';
import { RBACBridge } from '@/rbac/bridge';
import { AuthEventType, LogCategory } from '@/shared/types/shared.types';
import { useLogger } from '@/hooks/use-logger';

interface AccountLinkingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountLinkingModal: React.FC<AccountLinkingModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const logger = useLogger('AccountLinkingModal', LogCategory.AUTH);
  const [loading, setLoading] = useState<string | null>(null);
  
  useEffect(() => {
    // Listen for auth events to know when linking completes
    const unsubscribe = authBridge.onAuthEvent((event) => {
      if (event.type === AuthEventType.USER_UPDATED) {
        setLoading(null);
        onClose();
      }
    });
    
    // Cleanup subscription
    return () => {
      if (unsubscribe && typeof unsubscribe.unsubscribe === 'function') {
        unsubscribe.unsubscribe();
      }
    };
  }, [onClose]);
  
  const handleLinkAccount = async (provider: string) => {
    try {
      setLoading(provider);
      const success = await authBridge.linkAccount(provider);
      
      if (!success) {
        throw new Error(`Failed to link ${provider} account`);
      }
      
      logger.info(`Successfully initiated ${provider} account linking`);
    } catch (error) {
      logger.error(`Error linking ${provider} account`, { details: { error } });
      toast({
        title: 'Error Linking Account',
        description: `Could not link your ${provider} account. Please try again.`,
        variant: 'destructive',
      });
      setLoading(null);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Link External Accounts</DialogTitle>
          <DialogDescription>
            Connect your social accounts for easier login and additional features.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            className="flex items-center justify-start gap-2"
            disabled={loading === 'google'}
            onClick={() => handleLinkAccount('google')}
          >
            <Google className="h-4 w-4" />
            {loading === 'google' ? 'Connecting...' : 'Connect Google Account'}
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center justify-start gap-2"
            disabled={loading === 'github'}
            onClick={() => handleLinkAccount('github')}
          >
            <Github className="h-4 w-4" />
            {loading === 'github' ? 'Connecting...' : 'Connect GitHub Account'}
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center justify-start gap-2"
            disabled={loading === 'twitter'}
            onClick={() => handleLinkAccount('twitter')}
          >
            <Twitter className="h-4 w-4" />
            {loading === 'twitter' ? 'Connecting...' : 'Connect Twitter Account'}
          </Button>
        </div>
        
        <DialogFooter>
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
