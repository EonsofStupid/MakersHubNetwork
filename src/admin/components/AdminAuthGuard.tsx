
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AccessDenied } from './auth/AccessDenied';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';
import { UserRole, AuthStatus } from '@/shared/types/shared.types';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  requiredPermission?: string;
  redirectPath?: string;
}

export function AdminAuthGuard({ 
  children, 
  requiredRole = UserRole.ADMIN, 
  requiredPermission, 
  redirectPath = '/login' 
}: AdminAuthGuardProps) {
  const auth = useAuth();
  const location = useLocation();
  const logger = useLogger('AdminAuthGuard', LogCategory.AUTH);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      // Wait for auth state to be ready
      if (auth.isLoading) {
        return;
      }

      if (!auth.isAuthenticated) {
        logger.info('User not authenticated', { 
          redirectPath,
          requiredRole,
          requiredPermission
        });
        setIsAuthorized(false);
        return;
      }
      
      // Check role if required
      if (requiredRole) {
        const hasRequiredRole = auth.hasRole(requiredRole);
        if (!hasRequiredRole) {
          logger.warn('User lacks required role', { 
            requiredRole,
            userRoles: auth.roles
          });
          setIsAuthorized(false);
          return;
        }
      }
      
      // Check permission if required
      if (requiredPermission) {
        // This would call a permission check function if you have one
        const hasPermission = true; // Placeholder
        if (!hasPermission) {
          logger.warn('User lacks required permission', { 
            requiredPermission 
          });
          setIsAuthorized(false);
          return;
        }
      }
      
      // If we get here, user is authorized
      logger.debug('User authorized for admin access');
      setIsAuthorized(true);
    };
    
    checkAuth();
  }, [auth.isAuthenticated, auth.isLoading, auth.roles, auth.hasRole, requiredRole, requiredPermission, redirectPath, logger]);
  
  // Show loading state while checking
  if (auth.status === AuthStatus.LOADING || auth.status === AuthStatus.INITIAL) {
    return <div>Loading...</div>;
  }
  
  // Not authenticated, redirect to login
  if (!auth.isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }
  
  // Authentication check complete but not authorized for this admin section
  if (isAuthorized === false) {
    return <AccessDenied requiredRole={requiredRole} />;
  }
  
  // All checks passed, render children
  return <>{children}</>;
}
