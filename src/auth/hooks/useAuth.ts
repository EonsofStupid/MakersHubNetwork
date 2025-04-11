
import { useCallback } from 'react';
import { authBridge } from '@/bridges/AuthBridge';
import { User, UserRole } from '@/shared/types';

/**
 * Hook to access authentication state and methods
 */
export function useAuth() {
  const user = authBridge.getUser();
  const status = authBridge.getStatus();

  const signIn = useCallback(async (email: string, password: string) => {
    return authBridge.signIn(email, password);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    return authBridge.signInWithGoogle();
  }, []);

  const logout = useCallback(async () => {
    return authBridge.logout();
  }, []);

  const hasRole = useCallback((role: UserRole | UserRole[]) => {
    return authBridge.hasRole(role);
  }, []);

  const isAdmin = useCallback(() => {
    return authBridge.isAdmin();
  }, []);

  const isSuperAdmin = useCallback(() => {
    return authBridge.isSuperAdmin();
  }, []);

  return {
    user,
    status,
    signIn,
    signInWithGoogle,
    logout,
    hasRole,
    isAdmin,
    isSuperAdmin,
  };
}
