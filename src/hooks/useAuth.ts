
import { useEffect, useState, useCallback } from 'react';
import { authBridge } from '@/bridges/AuthBridge';
import { AuthStatus, User, UserRole } from '@/shared/types/shared.types';

interface UseAuthResult {
  user: User | null;
  profile: any | null;
  status: AuthStatus;
  roles: UserRole[];
  
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.IDLE);
  const [roles, setRoles] = useState<UserRole[]>([]);
  
  // Load initial session
  useEffect(() => {
    const loadSession = async () => {
      try {
        setStatus(AuthStatus.LOADING);
        
        const session = await authBridge.getCurrentSession();
        
        if (session) {
          const currentUser = await authBridge.getUserProfile(session.user.id);
          setUser(session.user);
          setProfile(currentUser);
          setStatus(AuthStatus.AUTHENTICATED);
          
          // Set mock roles for now - in a real app you'd fetch these from your backend
          const mockRoles = ['user'] as UserRole[];
          if (session.user.email?.includes('admin')) {
            mockRoles.push('admin');
          }
          setRoles(mockRoles);
        } else {
          setUser(null);
          setProfile(null);
          setRoles([]);
          setStatus(AuthStatus.UNAUTHENTICATED);
        }
      } catch (error) {
        console.error('Error loading session:', error);
        setStatus(AuthStatus.ERROR);
      }
    };
    
    loadSession();
  }, []);
  
  // Subscribe to auth events
  useEffect(() => {
    const unsubscribe = authBridge.subscribeToAuthEvents((event) => {
      if (event.type === 'SIGNED_IN') {
        const loadUser = async () => {
          try {
            const currentUser = await authBridge.getUserProfile(event.payload?.user?.id);
            setUser(event.payload?.user || null);
            setProfile(currentUser);
            setStatus(AuthStatus.AUTHENTICATED);
            
            // Set mock roles for now
            const mockRoles = ['user'] as UserRole[];
            if (event.payload?.user?.email?.includes('admin')) {
              mockRoles.push('admin');
            }
            setRoles(mockRoles);
          } catch (error) {
            console.error('Error loading user profile:', error);
          }
        };
        loadUser();
      } else if (event.type === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setRoles([]);
        setStatus(AuthStatus.UNAUTHENTICATED);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Sign in handler
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setStatus(AuthStatus.LOADING);
      await authBridge.signInWithEmail(email, password);
      // Auth state will be updated via the subscription
    } catch (error) {
      console.error('Sign in error:', error);
      setStatus(AuthStatus.ERROR);
      throw error;
    }
  }, []);
  
  // Sign out handler
  const signOut = useCallback(async () => {
    try {
      await authBridge.signOut();
      // Auth state will be updated via the subscription
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }, []);
  
  // Role checker
  const hasRole = useCallback((role: UserRole | UserRole[]) => {
    if (Array.isArray(role)) {
      return role.some(r => roles.includes(r));
    }
    return roles.includes(role);
  }, [roles]);
  
  return {
    user,
    profile,
    status,
    roles,
    signIn,
    signOut,
    hasRole
  };
}
