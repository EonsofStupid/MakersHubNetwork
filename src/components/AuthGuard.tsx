
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { AuthStatus, UserRole } from '@/types/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireRole?: UserRole | UserRole[];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  redirectTo = '/login',
  requireRole,
}) => {
  const { status, session, user, roles } = useAuth();

  // Still loading the auth state
  if (status === AuthStatus.LOADING) {
    return <div>Loading authentication status...</div>;
  }

  // Not authenticated
  if (status !== AuthStatus.AUTHENTICATED || !session) {
    return <Navigate to={redirectTo} />;
  }

  // Check for required role(s)
  if (requireRole) {
    const requiredRoles = Array.isArray(requireRole) ? requireRole : [requireRole];
    
    // Ensure user has at least one of the required roles
    const hasRequiredRole = requiredRoles.some(role => 
      roles.includes(role as UserRole)
    );
    
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" />;
    }
  }

  return <>{children}</>;
};
