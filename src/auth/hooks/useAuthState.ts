
import { useState, useEffect } from 'react';
import { authBridge } from '@/bridges/AuthBridge';
import { User, UserProfile, UserRole } from '@/shared/types/user';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(authBridge.getUser());
  const [profile, setProfile] = useState<UserProfile | null>(authBridge.getProfile());
  const [roles, setRoles] = useState<UserRole[]>(authBridge.getUserRoles());
  const [status, setStatus] = useState({
    isAuthenticated: !!authBridge.getUser(),
    isLoading: authBridge.status.isLoading
  });
  
  useEffect(() => {
    // Subscribe to auth events
    const unsubscribe = authBridge.subscribeToAuthEvents((event, data) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setUser(data);
        setRoles(authBridge.getUserRoles());
        setStatus(prev => ({ ...prev, isAuthenticated: true, isLoading: false }));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setRoles([]);
        setStatus(prev => ({ ...prev, isAuthenticated: false, isLoading: false }));
      } else if (event === 'PROFILE_FETCHED') {
        setProfile(data);
      }
    });
    
    return unsubscribe;
  }, []);
  
  const hasRole = (role: UserRole | UserRole[] | undefined) => {
    if (!role) return false;
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
    profile,
    roles,
    status,
    isAuthenticated: status.isAuthenticated,
    isLoading: status.isLoading,
    hasRole,
    isAdmin,
    isSuperAdmin
  };
}
