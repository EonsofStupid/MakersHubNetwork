
import React from 'react';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { CircularProgress } from './CircularProgress';
import { getLogger } from '@/logging';

// Create logger
const logger = getLogger('AuthGuard');

export interface AuthGuardProps {
  children: React.ReactNode;
  publicRoute?: boolean;
  adminRequired?: boolean;
  fallback?: React.ReactNode;
}

export function AuthGuard({ 
  children, 
  publicRoute = false,
  adminRequired = false,
  fallback 
}: AuthGuardProps) {
  const { isAuthenticated, isInitializing } = useAuthState();
  
  // For public routes, always render children regardless of auth state
  if (publicRoute) {
    logger.debug('AuthGuard rendering public route content');
    return <>{children}</>;
  }
  
  // If we're still initializing and it's not a public route, show loading state
  if (isInitializing && !publicRoute) {
    return fallback || (
      <div className="w-full h-40 flex items-center justify-center">
        <CircularProgress size="md" />
      </div>
    );
  }
  
  // For protected routes, check authentication
  if (!isInitializing && !isAuthenticated && !publicRoute) {
    logger.debug('AuthGuard blocking protected route due to missing authentication');
    return fallback || (
      <div className="p-4">
        <h2 className="text-lg font-medium">Authentication Required</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Please sign in to view this content.
        </p>
      </div>
    );
  }
  
  // User is authenticated or route is public, render children
  return <>{children}</>;
}
