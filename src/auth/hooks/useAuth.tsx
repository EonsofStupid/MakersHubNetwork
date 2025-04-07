
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';

// Define accepted user roles
export type UserRole = 'admin' | 'super_admin' | 'maker' | 'builder' | 'user' | 'moderator' | 'editor' | 'viewer' | 'service';

export interface AuthUser extends User {
  role?: UserRole;
  display_name?: string;
  avatar_url?: string;
}

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  session: Session | null;
  error: Error | null;
  status?: 'loading' | 'authenticated' | 'unauthenticated' | 'error';
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (profile: Partial<AuthUser>) => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  refreshSession: () => Promise<void>;
}

export type AuthContextType = AuthState & AuthActions;

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    session: null,
    error: null,
    status: 'loading'
  });

  const logger = useLogger('useAuth', LogCategory.AUTH);

  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    if (!authState.user || !authState.user.role) return false;
    
    if (Array.isArray(role)) {
      return role.includes(authState.user.role as UserRole);
    }
    
    return authState.user.role === role;
  }, [authState.user]);

  const login = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null, status: 'loading' }));
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        logger.error(`Login failed for user ${email}`, { details: { error: error.message } });
        throw error;
      }

      const authUser = data.user as AuthUser;
      setAuthState({
        isLoading: false,
        isAuthenticated: true,
        user: authUser,
        session: data.session,
        error: null,
        status: 'authenticated'
      });

      logger.info(`User ${email} logged in successfully`, { details: { userId: authUser.id } });
    } catch (err: any) {
      logger.error(`Login attempt failed for user ${email}`, { details: { error: err.message } });
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error('Login failed'),
        status: 'error'
      }));
    }
  }, [logger]);

  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null, status: 'loading' }));
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        logger.error('Logout failed', { details: { error: error.message } });
        throw error;
      }

      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        session: null,
        error: null,
        status: 'unauthenticated'
      });

      logger.info('User logged out successfully');
    } catch (err: any) {
      logger.error('Logout attempt failed', { details: { error: err.message } });
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error('Logout failed'),
        status: 'error'
      }));
    }
  }, [logger]);

  const register = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null, status: 'loading' }));
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        logger.error(`Registration failed for user ${email}`, { details: { error: error.message } });
        throw error;
      }

      // Don't automatically log in user after registration
      // They may need to verify their email first
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
        status: 'unauthenticated'
      }));

      logger.info(`User ${email} registered successfully`, { details: { userId: data.user?.id } });
    } catch (err: any) {
      logger.error(`Registration attempt failed for user ${email}`, { details: { error: err.message } });
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error('Registration failed'),
        status: 'error'
      }));
    }
  }, [logger]);

  const resetPassword = useCallback(async (email: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        logger.error(`Password reset failed for ${email}`, { details: { error: error.message } });
        throw error;
      }

      logger.info(`Password reset email sent to ${email}`);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (err: any) {
      logger.error(`Password reset attempt failed for ${email}`, { details: { error: err.message } });
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error('Password reset failed'),
      }));
    }
  }, [logger]);

  const updateProfile = useCallback(async (profile: Partial<AuthUser>) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: profile.display_name,
          avatar_url: profile.avatar_url,
        },
      });

      if (error) {
        logger.error('Profile update failed', { details: { error: error.message } });
        throw error;
      }

      if (authState.user) {
        const updatedUser: AuthUser = {
          ...authState.user,
          ...profile,
        };
        
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          user: updatedUser,
        }));
      }

      logger.info('User profile updated successfully');
    } catch (err: any) {
      logger.error('Profile update attempt failed', { details: { error: err.message } });
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error('Profile update failed'),
      }));
    }
  }, [authState.user, logger]);

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      if (data.session) {
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          user: data.session.user as AuthUser,
          session: data.session,
          error: null,
          status: 'authenticated'
        });
      } else {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          session: null,
          error: null,
          status: 'unauthenticated'
        });
      }
    } catch (error) {
      logger.error('Failed to refresh session', { 
        details: { error: error instanceof Error ? error.message : String(error) } 
      });
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Failed to refresh session'),
        status: 'error'
      }));
    }
  }, [logger]);

  // Initialize auth on component mount
  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user as AuthUser | null;
      
      if (event === 'SIGNED_IN') {
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          user,
          session,
          error: null,
          status: 'authenticated'
        });
        logger.info('User signed in', { details: { userId: user?.id, event } });
      } else if (event === 'SIGNED_OUT') {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          session: null,
          error: null,
          status: 'unauthenticated'
        });
        logger.info('User signed out', { details: { event } });
      } else if (event === 'USER_UPDATED') {
        setAuthState(prev => ({
          ...prev,
          user,
          session,
        }));
        logger.info('User updated', { details: { userId: user?.id, event } });
      }
    });

    // Check for existing session
    refreshSession();

    // Cleanup subscription
    return () => {
      subscription.data.subscription.unsubscribe();
    };
  }, [logger, refreshSession]);

  return {
    ...authState,
    login,
    logout,
    register,
    resetPassword,
    updateProfile,
    hasRole,
    refreshSession
  };
}
