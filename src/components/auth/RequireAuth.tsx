
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/hooks/useAuth';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/constants/logLevel';

interface RequireAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function RequireAuth({ children, redirectTo = '/login' }: RequireAuthProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const logger = useLogger('RequireAuth', { category: LogCategory.AUTH });

  if (isLoading) {
    // Show a loading state while authentication is being determined
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    logger.warn('User not authenticated, redirecting to login');
    // Redirect them to the login page with a return path
    return <Navigate to={`${redirectTo}?from=${encodeURIComponent(location.pathname)}`} />;
  }

  return <>{children}</>;
}
