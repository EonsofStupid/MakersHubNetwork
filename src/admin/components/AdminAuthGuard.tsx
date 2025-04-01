
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const { user, isAuthenticated, isAdmin, isSuperAdmin, isLoading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const logger = useLogger('AdminAuthGuard', LogCategory.ADMIN);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !isAdmin && !isSuperAdmin) {
      logger.warn('Non-admin user attempted to access admin area', {
        details: { path: location.pathname, userId: user?.id }
      });
      
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel",
        variant: "destructive"
      });
    }
  }, [isLoading, isAuthenticated, isAdmin, isSuperAdmin, location.pathname, toast, user, logger]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to unauthorized page if authenticated but not admin
  if (!isAdmin && !isSuperAdmin) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  // Render children if authenticated and has admin access
  return <>{children}</>;
}

