
import { useEffect, useState } from 'react';
import { authBridge } from '@/bridges';
import { UserRole } from '@/shared/types/auth.types';

/**
 * Hook to check if the current user has a specific role or roles
 */
export function useHasRole(role?: UserRole | UserRole[]) {
  const [hasRole, setHasRole] = useState(() => {
    return role ? authBridge.hasRole(role) : false;
  });

  useEffect(() => {
    // Update whenever auth state changes
    const unsubscribe = authBridge.subscribeToAuthEvents(() => {
      setHasRole(role ? authBridge.hasRole(role) : false);
    });
    
    return unsubscribe;
  }, [role]);

  return hasRole;
}

export function useHasAdminAccess() {
  const [hasAccess, setHasAccess] = useState(() => {
    return authBridge.isAdmin();
  });

  useEffect(() => {
    // Update whenever auth state changes
    const unsubscribe = authBridge.subscribeToAuthEvents(() => {
      setHasAccess(authBridge.isAdmin());
    });
    
    return unsubscribe;
  }, []);

  return hasAccess;
}

export function useIsSuperAdmin() {
  const [isSuperAdmin, setIsSuperAdmin] = useState(() => {
    return authBridge.isSuperAdmin();
  });

  useEffect(() => {
    // Update whenever auth state changes
    const unsubscribe = authBridge.subscribeToAuthEvents(() => {
      setIsSuperAdmin(authBridge.isSuperAdmin());
    });
    
    return unsubscribe;
  }, []);

  return isSuperAdmin;
}
