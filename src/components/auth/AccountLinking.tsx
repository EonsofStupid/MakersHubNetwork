import React, { useState, useEffect } from 'react';
import { useAuth } from '@/auth/hooks/useAuth';
import { removeSocialLink, getSocialLinks } from '@/auth/services/authService';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/constants/logLevel';
import { Loader2 } from 'lucide-react';

// Fixed types for provider identities
interface UserIdentity {
  provider: 'github' | 'google';
  id: string;
  user_id?: string;
  identity_id?: string;
}

export const AccountLinking: React.FC = () => {
  const { user } = useAuth();
  const [linkedAccounts, setLinkedAccounts] = useState<UserIdentity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const logger = useLogger('AccountLinking', { category: LogCategory.AUTH });

  useEffect(() => {
    const fetchLinkedAccounts = async () => {
      setIsLoading(true);
      try {
        if (!user?.id) {
          logger.warn('No user ID available to fetch linked accounts.');
          return;
        }
        const accounts = await getSocialLinks(user.id);
        setLinkedAccounts(accounts);
        logger.debug('Linked accounts fetched successfully.', { details: { count: accounts.length } });
      } catch (error: any) {
        logger.error('Failed to fetch linked accounts.', { details: { error: error.message } });
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load linked accounts.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinkedAccounts();
  }, [user?.id, toast, logger]);

  const removeIdentity = async (identity: UserIdentity) => {
    setIsLoading(true);
    
    try {
      // Add the required properties to satisfy the UserIdentity type
      const fullIdentity: UserIdentity = {
        ...identity,
        user_id: user?.id || '',
        identity_id: identity.id
      };
      
      // Now pass the compliant identity object
      const result = await removeSocialLink(fullIdentity);
      
      if (result.success) {
        setLinkedAccounts(prev => prev.filter(account => account.id !== identity.id));
        toast({
          title: 'Account Unlinked',
          description: `Successfully unlinked your ${identity.provider} account.`,
        });
        logger.info('Account unlinked successfully.', { details: { provider: identity.provider } });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Failed to unlink your ${identity.provider} account.`,
        });
        logger.error('Failed to unlink account.', {
          details: { provider: identity.provider, error: result.error },
        });
      }
    } catch (error: any) {
      logger.error('Error during account unlinking.', {
        details: { provider: identity.provider, error: error.message },
      });
      toast({
        variant: 'destructive',
        title: 'Unexpected Error',
        description: `An unexpected error occurred while unlinking your ${identity.provider} account.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading linked accounts...
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Linked Accounts</h3>
      {linkedAccounts.length === 0 ? (
        <p className="text-muted-foreground">No linked accounts found.</p>
      ) : (
        <ul className="space-y-2">
          {linkedAccounts.map(account => (
            <li key={account.id} className="flex items-center justify-between p-2 border rounded-md">
              <span className="font-medium">{account.provider}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeIdentity(account)}
                disabled={isLoading}
              >
                Unlink
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
