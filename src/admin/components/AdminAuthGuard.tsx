
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { AccessDenied } from './auth/AccessDenied';
import { UserRole } from '@/types/shared';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/auth/store/auth.store';
import { useHasRole, useHasAdminAccess } from '@/auth/hooks/useHasRole';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[] | undefined;
}

/**
 * AdminAuthGuard
 * 
 * Protects admin routes to ensure only authorized users can access them.
 * Redirects unauthenticated users to login and unauthorized users to access denied.
 * Uses the standardized role checking system.
 */
export function AdminAuthGuard({ 
  children, 
  requiredRole 
}: AdminAuthGuardProps) {
  // Get auth status directly from authStore to ensure consistency
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const status = useAuthStore(state => state.status);
  const roles = useAuthStore(state => state.roles);
  
  // Use our standardized hooks
  const hasAdminAccess = useHasAdminAccess();
  
  // Other hooks
  const logger = useLogger('AdminAuthGuard', LogCategory.ADMIN);
  const { toast } = useToast();
  
  // Check if user has required role using our hook
  const hasRequiredRole = requiredRole 
    ? useHasRole(requiredRole)
    : true;
  
  // Execute guard check on mount
  useEffect(() => {
    if (!isAuthenticated) {
      logger.warn('Unauthenticated user attempted to access admin route');
      return;
    }
    
    if (!hasAdminAccess) {
      logger.warn('Non-admin user attempted to access admin route', {
        details: { roles, requiredRole }
      });
      
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access this admin area',
        variant: 'destructive'
      });
      return;
    }
    
    // Always log admin access attempts for debugging
    if (hasAdminAccess) {
      logger.info('Admin user accessing protected route', {
        details: { 
          userId: user?.id,
          roles,
          hasAdminAccess,
          requiredRole
        }
      });
    }
  }, [isAuthenticated, hasAdminAccess, logger, roles, requiredRole, toast, user]);
  
  // Show nothing while authenticating
  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="relative">
          <div className="h-32 w-32 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full border-r-2 border-l-2 border-secondary animate-spin animate-reverse"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check for admin access
  if (!hasAdminAccess) {
    return <AccessDenied />;
  }
  
  // Check for specific roles if required
  if (requiredRole && !hasRequiredRole) {
    return <AccessDenied missingRole={requiredRole} />;
  }
  
  // User has access, render children
  return <>{children}</>;
}
