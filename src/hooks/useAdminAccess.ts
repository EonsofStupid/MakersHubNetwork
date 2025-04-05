
import { useEffect, useState } from 'react';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { hasAdminAccess } from '@/auth/rbac/roles';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { UserRole } from '@/auth/types/roles';

interface AdminAccessOptions {
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
}

/**
 * Hook for checking admin access permissions
 * Uses useAuthState directly to avoid circular dependencies
 */
export function useAdminAccess(options: AdminAccessOptions = { requireAuth: true }) {
  const { status, roles, user } = useAuthState();
  const [isChecking, setIsChecking] = useState(true);
  const logger = useLogger("useAdminAccess", LogCategory.ADMIN);
  
  // Derived state
  const isAuthenticated = status === 'authenticated' && !!user;
  const adminAccessResult = hasAdminAccess(roles);
  
  useEffect(() => {
    if (status !== 'loading') {
      setIsChecking(false);
    }
  }, [status]);
  
  // Log access attempts only once
  useEffect(() => {
    if (!isChecking && isAuthenticated) {
      const logLevel = adminAccessResult ? 'info' : 'warn';
      
      logger[logLevel]('Admin access check', {
        details: {
          userId: user?.id,
          hasAccess: adminAccessResult,
          roles
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChecking, isAuthenticated, adminAccessResult]);
  
  return {
    isLoading: isChecking,
    isAuthenticated,
    hasAdminAccess: adminAccessResult
  };
}
