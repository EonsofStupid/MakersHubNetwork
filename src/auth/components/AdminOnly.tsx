import React from 'react';
import { useAuthStore } from '../store/auth.store';
import { UserRole } from '../types/roles';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useHasRole, useHasAdminAccess } from '../hooks/useHasRole';

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
