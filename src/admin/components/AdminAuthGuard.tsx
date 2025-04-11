
import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authBridge } from '@/bridges/AuthBridge';
import { UserRole } from '@/shared/types/auth.types';

interface AdminAuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
}

/**
 * A component that guards access to admin routes based on user role
 */
export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({
  children,
  requiredRole = ['admin', 'super_admin'],
  redirectTo = '/admin/unauthorized'
}) => {
  const location = useLocation();

  // Check if the user is authenticated
  if (!authBridge.status.isAuthenticated) {
    return (
      <Navigate
        to="/auth/login"
        state={{ from: location }}
        replace
      />
    );
  }
  
  // Check if the authentication is still loading
  if (authBridge.status.isLoading) {
    return <div>Loading...</div>;
  }

  // Check if user has the required role
  if (!authBridge.hasRole(requiredRole)) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location }}
        replace
      />
    );
  }

  // User is authenticated and has the required role
  return <>{children}</>;
};

export default AdminAuthGuard;
