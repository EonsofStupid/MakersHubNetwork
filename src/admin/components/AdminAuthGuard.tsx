
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAdminAccess } from '@/admin/hooks/useAdminAccess';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useAuth } from '@/auth/hooks/useAuth';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasAdminAccess, isLoading: adminLoading } = useAdminAccess();
  const { isLoading: authLoading, isAuthenticated, status, initialize } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const logger = useLogger('AdminAuthGuard', LogCategory.ADMIN);
  
  const isLoading = authLoading || adminLoading;
  
  useEffect(() => {
    // Initialize auth if needed
    logger.info('Initializing auth check');
    initialize().catch(error => {
      logger.error('Failed to initialize auth store', { details: error });
    });
  }, [initialize, logger]);
  
  useEffect(() => {
    // Only run this check once auth is no longer loading
    if (!isLoading && !authChecked) {
      logger.info('Auth check completed', { 
        details: { 
          isAuthenticated, 
          hasAdminAccess, 
          status
        } 
      });
      
      setAuthChecked(true);
      
      if (!isAuthenticated) {
        logger.info('User not authenticated, redirecting to login page');
        toast({
          title: 'Authentication Required',
          description: 'Please log in to access the admin section',
          variant: 'default'
        });
        navigate('/login?from=/admin');
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
  }, [isLoading, isAuthenticated, hasAdminAccess, navigate, toast, logger, authChecked, status]);
  
  if (isLoading || !authChecked || status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="h-8 w-8 border-t-2 border-primary animate-spin rounded-full mb-4" />
        <p className="text-primary">Loading admin panel...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Redirect happens in useEffect
  }
  
  if (!hasAdminAccess) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}
