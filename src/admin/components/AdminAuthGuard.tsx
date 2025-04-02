
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAdminAccess } from '@/admin/hooks/useAdminAccess';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useAuthStore } from '@/auth/store/auth.store';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { hasAdminAccess, isLoading, isAuthenticated } = useAdminAccess();
  const authStore = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);
  const logger = useLogger('AdminAuthGuard', LogCategory.ADMIN);
  
  useEffect(() => {
    // If auth store isn't initialized yet, initialize it
    if (!authStore.initialized) {
      logger.info('Auth store not initialized, initializing now');
      authStore.initialize().catch(error => {
        logger.error('Failed to initialize auth store', { details: error });
      });
    }
  }, [authStore, logger]);
  
  useEffect(() => {
    // Only run this check once auth is no longer loading
    if (!isLoading && !authChecked) {
      logger.info('Auth check completed', { 
        details: { 
          isAuthenticated, 
          hasAdminAccess, 
          status: authStore.status,
          roles: authStore.roles
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
        logger.warn('User does not have admin access, redirecting to home page', {
          details: { roles: authStore.roles }
        });
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access the admin section',
          variant: 'destructive'
        });
        navigate('/');
      }
    }
  }, [isLoading, isAuthenticated, hasAdminAccess, navigate, toast, logger, authChecked, authStore.status, authStore.roles]);
  
  if (isLoading || !authChecked || authStore.status === 'loading') {
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
