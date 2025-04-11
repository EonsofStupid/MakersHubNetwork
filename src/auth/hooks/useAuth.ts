
import { useEffect, useState } from 'react';
import { authBridge } from '@/bridges/AuthBridge';
import { User, UserRole } from '@/shared/types/auth.types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(authBridge.getUser());
  const [status, setStatus] = useState(authBridge.getStatus());

  useEffect(() => {
    const unsubscribe = authBridge.subscribeToAuthEvents((updatedUser) => {
      setUser(updatedUser);
      setStatus(authBridge.getStatus());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    return await authBridge.signIn(email, password);
  };

  const signInWithGoogle = async () => {
    return await authBridge.signInWithGoogle();
  };

  const logout = async () => {
    return await authBridge.logout();
  };

  const hasRole = (role: UserRole | UserRole[]) => {
    return authBridge.hasRole(role);
  };

  const isAdmin = () => {
    return authBridge.isAdmin();
  };

  const isSuperAdmin = () => {
    return authBridge.isSuperAdmin();
  };

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

export default useAuth;
