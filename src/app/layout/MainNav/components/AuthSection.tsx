
import React from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { UserMenu } from '@/app/components/auth/UserMenu';
import { AuthSheet } from '@/app/components/auth/AuthSheet';
import { RBACBridge } from '@/rbac/bridge';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

const AuthSection: React.FC = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const logger = useLogger('AuthSection', LogCategory.AUTH);

  // Log roles for debugging
  React.useEffect(() => {
    if (isAuthenticated) {
      const roles = RBACBridge.getRoles();
      logger.debug('User roles in AuthSection', {
        details: { roles }
      });
    }
  }, [isAuthenticated, logger]);
  
  return (
    <div className="flex items-center gap-2">
      {isAuthenticated ? (
        <UserMenu />
      ) : (
        <AuthSheet />
      )}
    </div>
  );
};

export default AuthSection;
