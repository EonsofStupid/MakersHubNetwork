
import React, { ReactNode } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from '@/rbac/bridge';
import { AccessDenied } from './AccessDenied';
import { AUTH_STATUS, UserRole, ROLES } from '@/shared/types/shared.types';

interface AdminAuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
}

/**
 * AdminAuthGuard component
 * Protects admin routes by checking authentication and admin role
 */
export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ 
  children, 
  requiredRole = [ROLES.ADMIN, ROLES.SUPER_ADMIN]
}) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const status = useAuthStore(state => state.status);

  // Show loading state while initializing
  if (status === AUTH_STATUS.LOADING) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Check if user is authenticated and has admin role
  const hasRequiredRole = isAuthenticated && RBACBridge.hasRole(requiredRole);

  // Show unauthorized error if not authenticated or not admin
  if (!hasRequiredRole) {
    return <AccessDenied />;
  }

  // Render children if authenticated and has required role
  return <>{children}</>;
};
