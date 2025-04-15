import React, { useEffect } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { useToast } from '@/shared/ui/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

export function LinkedAccountAlert() {
  const user = useAuthStore(state => state.user);
  const { toast } = useToast();
  const logger = useLogger("LinkedAccountAlert", LogCategory.AUTH);

  useEffect(() => {
    if (user?.email) {
      toast({
        title: "Account Linked",
        description: `Your account is linked to ${user.email}.`,
      });
      logger.info("Account linked alert displayed", { userEmail: user.email });
    }
  }, [user, toast, logger]);

  return null;
}
