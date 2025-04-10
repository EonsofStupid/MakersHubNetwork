
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/admin/hooks/useAdminAuth';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { AccessDenied } from './auth/AccessDenied';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

/**
 * AdminAuthGuard
 * 
 * Protects admin routes to ensure only authorized users can access them.
 * Redirects unauthenticated users to login and unauthorized users to access denied.
 */
export function AdminAuthGuard({ 
  children, 
  requiredRole 
}: AdminAuthGuardProps) {
  const { 
    isAuthenticated, 
    hasAdminAccess, 
    status, 
    hasRole, 
    roles
  } = useAdminAuth();
  
  const logger = useLogger('AdminAuthGuard', LogCategory.ADMIN);
  
  useEffect(() => {
    if (status === 'authenticated' && !hasAdminAccess) {
      logger.warn('Non-admin user attempted to access admin route', {
        details: { roles, requiredRole }
      });
    }
  }, [status, hasAdminAccess, roles, requiredRole, logger]);
  
  // Show nothing while authenticating
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (status !== 'loading' && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check for admin access
  if (!hasAdminAccess) {
    return <AccessDenied />;
  }
  
  // Check for specific roles if required
  if (requiredRole && !hasRole(requiredRole)) {
    return <AccessDenied missingRole={requiredRole} />;
  }
  
  // User has access, render children
  return <>{children}</>;
}
