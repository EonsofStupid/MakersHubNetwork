import React from 'react';
import { useHasAdminAccess } from '../hooks/useHasRole';
import { UserRole } from '../types/roles';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useAuthStore } from '../store/auth.store';

interface AdminOnlyProps {
  children: React.ReactNode;
  role?: UserRole | UserRole[];
  fallback?: React.ReactNode;
}

/**
 * Component that only renders its children if the user has admin access
 */
export function AdminOnly({ children, role, fallback = null }: AdminOnlyProps) {
  const logger = useLogger('AdminOnly', LogCategory.AUTH);
  
  // If specific role is provided, check for that role
  // Otherwise, check for general admin access
  const hasAccess = role 
    ? useHasRole(role)
    : useHasAdminAccess();
  
  logger.debug('AdminOnly guard check', {
    details: { hasAccess, requiredRole: role }
  });
  
  if (!hasAccess) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

/**
 * Hook to check if the current user has any of the specified roles
 * Imported here to avoid circular dependencies
 */
function useHasRole(role: UserRole | UserRole[]) {
  const roles = useAuthStore((state) => state.roles);
  
  return React.useMemo(() => {
    if (Array.isArray(role)) {
      return role.some(r => roles.includes(r));
    }
    return roles.includes(role);
  }, [roles, role]);
}
