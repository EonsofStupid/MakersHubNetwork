
import { useCallback, useState } from 'react';
import { AuthBridge } from '@/bridges/AuthBridge';
import { UserProfile, UserRole, ROLES } from '@/shared/types/shared.types';
import { RBACBridge } from '@/bridges/RBACBridge';

export interface UseAuthReturn {
  user: UserProfile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (roleOrRoles: UserRole | UserRole[]) => boolean;
  roles: UserRole[];
}

export function useAuth(): UseAuthReturn {
  const [isLoading, setIsLoading] = useState(false);
  const user = AuthBridge.getUser();
  
  const signIn = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      await AuthBridge.signInWithEmail(email, password);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const signOut = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await AuthBridge.signOut();
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const signUp = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      await AuthBridge.signUp(email, password);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const hasRole = useCallback((roleOrRoles: UserRole | UserRole[]): boolean => {
    return RBACBridge.hasRole(roleOrRoles);
  }, []);
  
  // Get roles from RBAC bridge
  const roles = RBACBridge.getRoles();
  
  return {
    user,
    signIn,
    signOut,
    signUp,
    isAuthenticated: AuthBridge.isAuthenticated,
    isLoading,
    hasRole,
    roles
  };
}
