
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserRole } from '../constants/roles';
import { RBACBridge } from '../bridge';
import { useAuthStore } from '@/auth/store/auth.store';

interface WithRoleProtectionProps {
  allowedRoles?: UserRole | UserRole[];
  redirectPath?: string;
  children: React.ReactNode;
}

/**
 * Higher-order component that protects routes based on user roles
 */
export const withRoleProtection = (Component: React.ComponentType<any>, options: {
  allowedRoles?: UserRole | UserRole[];
  redirectPath?: string;
}) => {
  const { allowedRoles, redirectPath = '/auth' } = options;
  
  return function ProtectedRoute(props: any) {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const location = useLocation();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }
    
    // If no specific roles are required, allow access
    if (!allowedRoles) {
      return <Component {...props} />;
    }
    
    // Check if user has required roles
    const hasAccess = RBACBridge.hasRole(allowedRoles);
    
    if (!hasAccess) {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
    
    return <Component {...props} />;
  };
};

/**
 * Wrapper component for protecting routes based on user roles
 */
export const RouteGuard: React.FC<WithRoleProtectionProps> = ({
  children,
  allowedRoles,
  redirectPath = '/auth'
}) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const location = useLocation();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }
  
  // If no specific roles are required, allow access
  if (!allowedRoles) {
    return <>{children}</>;
  }
  
  // Check if user has required roles
  const hasAccess = RBACBridge.hasRole(allowedRoles);
  
  if (!hasAccess) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};
