import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
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
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { data: { session, user }, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        logger.error(`Login failed for user ${email}`, { details: { error: error.message } });
        throw error;
      }

      const authUser = user as AuthUser;
      setAuthState({
        isLoading: false,
        isAuthenticated: true,
        user: authUser,
        session: session,
        error: null,
      });

      logger.info(`User ${email} logged in successfully`, { details: { userId: authUser.id } });
    } catch (err: any) {
      logger.error(`Login attempt failed for user ${email}`, { details: { error: err.message } });
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error('Login failed'),
      }));
    }
  }, [logger]);

  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
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
      });

      logger.info('User logged out successfully');
    } catch (err: any) {
      logger.error('Logout attempt failed', { details: { error: err.message } });
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error('Logout failed'),
      }));
    }
  }, [logger]);

  const register = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { data: { session, user }, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        logger.error(`Registration failed for user ${email}`, { details: { error: error.message } });
        throw error;
      }

       const authUser = user as AuthUser;
      setAuthState({
        isLoading: false,
        isAuthenticated: true,
        user: authUser,
        session: session,
        error: null,
      });

      logger.info(`User ${email} registered successfully`, { details: { userId: authUser.id } });
    } catch (err: any) {
      logger.error(`Registration attempt failed for user ${email}`, { details: { error: err.message } });
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error('Registration failed'),
      }));
    }
  }, [logger]);

  const resetPassword = useCallback(async (email: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        logger.error(`Password reset failed for user ${email}`, { details: { error: error.message } });
        throw error;
      }

      setAuthState(prev => ({ ...prev, isLoading: false }));
      logger.info(`Password reset email sent to ${email}`);
    } catch (err: any) {
      logger.error(`Password reset attempt failed for user ${email}`, { details: { error: err.message } });
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
      if (!authState.user) {
        throw new Error('No user is currently authenticated.');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', authState.user.id)
        .select()
        .single();

      if (error) {
        logger.error(`Profile update failed for user ${authState.user.id}`, { details: { error: error.message } });
        throw error;
      }

      // Update the user object in auth state
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        user: { ...prev.user, ...profile },
      }));

      logger.info(`Profile updated successfully for user ${authState.user.id}`, { details: { userId: authState.user.id } });
    } catch (err: any) {
      logger.error('Profile update attempt failed', { details: { error: err.message } });
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error('Profile update failed'),
      }));
    }
  }, [logger, authState.user]);

  const refreshSession = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { data: { session, user }, error } = await supabase.auth.getSession();

      if (error) {
        logger.error('Session refresh failed', { details: { error: error.message } });
        throw error;
      }

      if (session && user) {
        const authUser = user as AuthUser;
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          user: authUser,
          session: session,
          error: null,
        });
        logger.info('Session refreshed successfully', { details: { userId: authUser.id } });
      } else {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          session: null,
          error: null,
        });
        logger.info('No active session found');
      }
    } catch (err: any) {
      logger.error('Session refresh attempt failed', { details: { error: err.message } });
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error('Session refresh failed'),
      }));
    }
  }, [logger]);

  useEffect(() => {
    const getInitialSession = async () => {
      await refreshSession();
    };

    getInitialSession();

    const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') {
        return;
      }

      if (session?.user) {
        const authUser = session.user as AuthUser;
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          user: authUser,
          session: session,
          error: null,
        });
        logger.info(`Auth state changed: ${event}`, { details: { userId: authUser.id } });
      } else {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          session: null,
          error: null,
        });
        logger.info(`Auth state changed: ${event}`);
      }
    });

    return () => {
      subscription.data.subscription.unsubscribe();
    };
  }, [logger, refreshSession]);

  return {
    ...authState,
    hasRole,
    login,
    logout,
    register,
    resetPassword,
    updateProfile,
    refreshSession,
  };
}
