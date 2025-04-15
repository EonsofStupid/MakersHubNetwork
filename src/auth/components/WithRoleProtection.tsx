
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/auth/hooks/useAuth';
import { UserRole, ROLES } from '@/shared/types/shared.types';

interface WithRoleProtectionProps {
  children: React.ReactNode;
  allowedRoles?: UserRole | UserRole[];
  redirectPath?: string;
}

/**
 * Role-based access control wrapper component
 * 
 * @param children - The children components to render if authorized
 * @param allowedRoles - The roles allowed to access the content
 * @param redirectPath - The path to redirect to if unauthorized
 * @returns The children if authorized, otherwise a redirect
 */
export default function WithRoleProtection({
  children,
  allowedRoles,
  redirectPath = '/login',
}: WithRoleProtectionProps) {
  const { user, isAuthenticated, hasRole } = useAuth();
  
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectPath} replace />;
  }
  
  // If no specific roles are required, allow anyone who's authenticated
  if (!allowedRoles) {
    return <>{children}</>;
  }
  
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  // Check for admin access
  if (roles.includes(ROLES.ADMIN) && hasRole([ROLES.ADMIN, ROLES.SUPER_ADMIN])) {
    return <>{children}</>;
  }
  
  // Check for super admin access
  if (roles.includes(ROLES.SUPER_ADMIN) && hasRole([ROLES.SUPER_ADMIN])) {
    return <>{children}</>;
  }
  
  // Check for moderator access
  if (roles.includes(ROLES.MODERATOR) && hasRole([ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN])) {
    return <>{children}</>;
  }
  
  // Check for builder access
  if (roles.includes(ROLES.BUILDER) && hasRole([ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN])) {
    return <>{children}</>;
  }
  
  // Check for user access
  if (roles.includes(ROLES.USER) && hasRole([ROLES.USER, ROLES.BUILDER, ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN])) {
    return <>{children}</>;
  }
  
  // If none of the above conditions are met, user doesn't have the required role
  return <Navigate to={redirectPath} replace />;
}
