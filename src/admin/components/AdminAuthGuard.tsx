
import React, { useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAdminAccess } from '@/admin/hooks/useAdminAccess';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';
import { useAuth } from '@/auth/hooks/useAuth';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { hasAdminAccess, isLoading: adminLoading } = useAdminAccess();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const logger = useLogger('AdminAuthGuard', { category: LogCategory.ADMIN });
  
  const isLoading = authLoading || adminLoading;
  
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        logger.info('User not authenticated, redirecting to login page');
        toast({
          title: 'Authentication Required',
          description: 'Please log in to access the admin section',
          variant: 'default'
        });
        navigate(`/login?from=${encodeURIComponent(location.pathname)}`);
      } else if (!hasAdminAccess) {
        logger.warn('User does not have admin access, redirecting to home page');
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access the admin section',
          variant: 'destructive'
        });
        navigate('/');
      }
    }
  }, [isLoading, isAuthenticated, hasAdminAccess, navigate, toast, logger, location.pathname]);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="h-8 w-8 border-t-2 border-primary animate-spin rounded-full mb-4" />
        <p className="text-primary">Loading admin panel...</p>
      </div>
    );
  }
  
  if (!isAuthenticated || !hasAdminAccess) {
    return null; // Will be handled by the useEffect
  }
  
  return <>{children}</>;
}
