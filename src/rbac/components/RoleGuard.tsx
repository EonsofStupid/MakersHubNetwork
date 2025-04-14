
import React from 'react';
import { UserRole } from '../constants/roles';
import { useRbac } from '../hooks/useRbac';

interface RoleGuardProps {
  children: React.ReactNode;
  role: UserRole | UserRole[];
  fallback?: React.ReactNode;
}

/**
 * Generic RoleGuard component
 * Only renders children if user has the specified role(s)
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  role, 
  fallback = null 
}) => {
  const { hasRole } = useRbac();
  
  if (!hasRole(role)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

/**
 * AdminGuard component
 * Only renders children if user has admin access
 */
export const AdminGuard: React.FC<{ 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => {
  const { hasAdminAccess } = useRbac();
  
  if (!hasAdminAccess()) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

/**
 * SuperAdminGuard component
 * Only renders children if user is a super admin
 */
export const SuperAdminGuard: React.FC<{ 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => {
  const { isSuperAdmin } = useRbac();
  
  if (!isSuperAdmin()) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

/**
 * ModeratorGuard component
 * Only renders children if user is a moderator or higher
 */
export const ModeratorGuard: React.FC<{ 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => {
  const { isModerator } = useRbac();
  
  if (!isModerator()) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

/**
 * BuilderGuard component
 * Only renders children if user is a builder or higher
 */
export const BuilderGuard: React.FC<{ 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => {
  const { isBuilder } = useRbac();
  
  if (!isBuilder()) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

/**
 * AuthGuard component
 * Only renders children if user is authenticated
 */
export const AuthGuard: React.FC<{ 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => {
  const { roles } = useRbac();
  const isAuthenticated = roles.length > 0 && !roles.includes(UserRole.GUEST);
  
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};
