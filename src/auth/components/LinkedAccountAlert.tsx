
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { authBridge } from '@/auth/bridge';
import { useToast } from '@/shared/hooks/use-toast';
import { useAuthStore } from '../store/auth.store';

export function LinkedAccountAlert() {
  const [pendingLink, setPendingLink] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthStore();

  useEffect(() => {
    // Check for pending links in URL
    const checkForPendingLinks = async () => {
      try {
        const hasPending = await authBridge.checkForPendingAccountLink();
        setPendingLink(hasPending);
      } catch (error) {
        console.error('Error checking pending links:', error);
      }
    };

    if (user) {
      checkForPendingLinks();
    }
  }, [user]);

  const handleConfirmLink = async () => {
    try {
      await authBridge.confirmAccountLink();
      toast({
        title: 'Success',
        description: 'Your accounts have been linked successfully.',
      });
      setPendingLink(false);
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to link accounts. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancelLink = () => {
    authBridge.cancelAccountLink();
    setPendingLink(false);
  };

  if (!pendingLink) {
    return null;
  }

  return (
    <Alert className="mb-4">
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span>
          We detected you're trying to link an account. Would you like to
          connect these accounts?
        </span>
        <div className="flex gap-2 self-end">
          <Button variant="outline" size="sm" onClick={handleCancelLink}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleConfirmLink}>
            Link Accounts
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
