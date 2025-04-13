
import React, { ReactNode } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from '@/rbac/bridge';
import { AccessDenied } from './AccessDenied';
import { ROLES, LogCategory, UserRole, AuthStatus } from '@/shared/types/shared.types';
import { useLogger } from '@/hooks/use-logger';

interface AdminAuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
}

/**
 * AdminAuthGuard component
 * Protects admin routes by checking authentication and admin role
 */
export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ 
  children, 
  requiredRole = [ROLES.ADMIN, ROLES.SUPER_ADMIN]
}) => {
  const { isAuthenticated, status } = useAuthStore();
  const logger = useLogger('AdminAuthGuard', LogCategory.ADMIN);

  // Log current roles
  React.useEffect(() => {
    if (isAuthenticated) {
      const roles = RBACBridge.getRoles();
      logger.debug('Current roles in AdminAuthGuard', {
        details: { roles, requiredRole }
      });
    }
  }, [isAuthenticated, requiredRole, logger]);

  // Show loading state while initializing
  if (status === AuthStatus.LOADING) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Check if user is authenticated and has admin role
  const hasRequiredRole = isAuthenticated && RBACBridge.hasRole(requiredRole);

  logger.debug('Access check result', { 
    details: { 
      isAuthenticated, 
      hasRequiredRole, 
      status 
    } 
  });

  // Show unauthorized error if not authenticated or not admin
  if (!hasRequiredRole) {
    return <AccessDenied />;
  }

  // Render children if authenticated and has required role
  return <>{children}</>;
};
