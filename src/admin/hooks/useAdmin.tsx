
import { useState, useEffect } from 'react';
import { useAuth } from '@/auth/hooks/useAuth';
import { UserRole } from '@/auth/types/auth.types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

export interface UseAdminResult {
  roles: UserRole[];
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isDevMode: boolean;
}

/**
 * Hook for admin functionality and role checking
 */
export function useAdmin(): UseAdminResult {
  const { roles: userRoles } = useAuth();
  const [isDevMode, setIsDevMode] = useState(false);
  const logger = getLogger('useAdmin', { category: LogCategory.ADMIN });

  // Check for development mode
  useEffect(() => {
    const isDev = import.meta.env.DEV || localStorage.getItem('dev-mode') === 'true';
    setIsDevMode(isDev);
    
    if (isDev) {
      logger.debug('Development mode is active');
    }
  }, [logger]);

  // Check if user has a specific role
  const hasRole = (role: string): boolean => {
    return userRoles.includes(role as UserRole);
  };

  // Check if user has any of the provided roles
  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => userRoles.includes(role as UserRole));
  };

  // Derived state
  const isAdmin = hasRole('admin') || hasRole('super_admin');
  const isSuperAdmin = hasRole('super_admin');

  return {
    roles: userRoles,
    hasRole,
    hasAnyRole,
    isAdmin,
    isSuperAdmin,
    isDevMode
  };
}
