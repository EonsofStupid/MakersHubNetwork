
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAccess } from '@/admin/hooks/useAdminAccess';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const { hasAdminAccess, isAuthenticated, isLoading } = useAdminAccess();
  const navigate = useNavigate();
  const { toast } = useToast();
  const logger = useLogger('AdminAuthGuard', LogCategory.ADMIN);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        logger.warn('Unauthenticated user attempted to access admin area');
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to access the admin area',
          variant: 'destructive'
        });
        navigate('/login', { replace: true });
      } else if (!hasAdminAccess) {
        logger.warn('Authenticated user without admin access attempted to access admin area');
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access the admin area',
          variant: 'destructive'
        });
        navigate('/admin/unauthorized', { replace: true });
      }
    }
  }, [isAuthenticated, hasAdminAccess, isLoading, navigate, toast, logger]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Shield className="h-12 w-12 text-primary animate-pulse" />
          <p className="text-sm text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !hasAdminAccess) {
    return null;
  }

  return <>{children}</>;
}
