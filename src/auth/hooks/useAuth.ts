
import { useState, useEffect } from 'react';
import { authBridge } from '@/bridges/AuthBridge';
import { User, UserProfile } from '@/shared/types/user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(authBridge.getUser());
  const [status, setStatus] = useState({
    isAuthenticated: !!authBridge.getUser(),
    isLoading: authBridge.status.isLoading
  });
  
  useEffect(() => {
    // Subscribe to auth events
    const unsubscribe = authBridge.subscribeToAuthEvents((event, data) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setUser(data);
        setStatus(prev => ({ ...prev, isAuthenticated: true, isLoading: false }));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setStatus(prev => ({ ...prev, isAuthenticated: false, isLoading: false }));
      }
    });
    
    return unsubscribe;
  }, []);
  
  // Authentication methods
  const signIn = async (email: string, password: string) => {
    setStatus(prev => ({ ...prev, isLoading: true }));
    try {
      const user = await authBridge.signIn(email, password);
      return user;
    } finally {
      setStatus(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  const signInWithGoogle = async () => {
    setStatus(prev => ({ ...prev, isLoading: true }));
    try {
      const user = await authBridge.signInWithGoogle();
      return user;
    } finally {
      setStatus(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  const logout = async () => {
    setStatus(prev => ({ ...prev, isLoading: true }));
    try {
      await authBridge.logout();
    } finally {
      setStatus(prev => ({ ...prev, isLoading: false }));
    }
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
    isSuperAdmin
  };
}
