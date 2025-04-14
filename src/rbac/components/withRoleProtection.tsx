
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserRole } from '../constants/roles';
import { useRbac } from '../hooks/useRbac';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRoles: UserRole | UserRole[];
  redirectTo?: string;
}

/**
 * Route Guard component for protecting routes by role
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  requiredRoles, 
  redirectTo = '/auth/login' 
}) => {
  const { hasRole } = useRbac();
  const location = useLocation();
  
  if (!hasRole(requiredRoles)) {
    // Redirect to login with return URL
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }
  
  return <>{children}</>;
};

/**
 * HOC that wraps a component with role protection
 * 
 * @param Component Component to protect
 * @param requiredRoles Roles required to access the component
 * @param redirectTo Redirect path if access is denied
 */
export function withRoleProtection<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles: UserRole | UserRole[],
  redirectTo: string = '/auth/login'
) {
  return function ProtectedRoute(props: P) {
    return (
      <RouteGuard requiredRoles={requiredRoles} redirectTo={redirectTo}>
        <Component {...props} />
      </RouteGuard>
    );
  };
}
