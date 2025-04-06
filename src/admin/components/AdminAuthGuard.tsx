
import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { router } from '@/router';
import { useToast } from '@/hooks/use-toast';
import { useAdminAccess } from '@/admin/hooks/useAdminAccess';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasAdminAccess, isLoading, isAuthenticated } = useAdminAccess();
  const logger = useLogger('AdminAuthGuard', LogCategory.ADMIN);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      logger.info('User not authenticated, redirecting to login page');
      navigate({ to: '/login', search: { from: '/admin' }});
    } else if (!isLoading && isAuthenticated && !hasAdminAccess) {
      logger.warn('User does not have admin access, redirecting to home page');
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access the admin section',
        variant: 'destructive'
      });
      navigate({ to: '/' });
    }
  }, [isLoading, isAuthenticated, hasAdminAccess, navigate, toast, logger]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 border-t-2 border-primary animate-spin rounded-full" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  if (!hasAdminAccess) {
    return null;
  }
  
  return <>{children}</>;
}
