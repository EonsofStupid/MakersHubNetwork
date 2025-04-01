
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { canAccessAdmin } from '@/auth/rbac/enforce';
import { useToast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const { roles, isLoading, isAuthenticated } = useAuthState();
  const { toast } = useToast();
  const logger = useLogger('AdminAuthGuard', LogCategory.ADMIN);
  
  const hasAccess = canAccessAdmin(roles);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      logger.info('User not authenticated, redirecting to login');
      toast({
        title: 'Authentication Required',
        description: 'Please log in to access the admin panel',
        variant: 'destructive',
      });
    } else if (!isLoading && isAuthenticated && !hasAccess) {
      logger.info('User lacks admin access, redirecting', { 
        details: { roles }
      });
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access the admin panel',
        variant: 'destructive',
      });
    }
  }, [isLoading, isAuthenticated, hasAccess, toast, logger, roles]);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="h-6 w-6 border-t-2 border-primary animate-spin rounded-full" />
      </div>
    );
  }
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect if no admin access
  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }
  
  // Render children if authenticated and has access
  return <>{children}</>;
}
