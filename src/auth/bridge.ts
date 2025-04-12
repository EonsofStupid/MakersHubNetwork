
import { AuthBridgeImpl } from './types/auth.types';
import { supabase } from './lib/supabase';
import { mapSupabaseUser } from '@/shared/types/auth-mapped.types';
import { User, UserRole, LogCategory } from '@/shared/types/shared.types';
import { EventEmitter } from 'events';

// Event emitter for auth events
const eventEmitter = new EventEmitter();

/**
 * Auth Bridge Implementation
 * Provides a consistent interface for auth operations across the application
 */
export const authBridge: AuthBridgeImpl = {
  
  // Auth state getters
  getUser: async (): Promise<User | null> => {
    const { data } = await supabase.auth.getUser();
    return mapSupabaseUser(data.user);
  },
  
  // Session methods
  getSession: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  getStatus: () => {
    return {
      status: 'loading', // Default status
    };
  },

  isAuthenticated: () => {
    const session = supabase.auth.session();
    return !!session;
  },
  
  // Sign in methods
  signInWithEmail: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    eventEmitter.emit('SIGNED_IN', { 
      user: mapSupabaseUser(data.user),
      session: data.session
    });
    
    return mapSupabaseUser(data.user);
  },

  signUpWithEmail: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
    
    if (error) throw error;
    
    eventEmitter.emit('SIGNED_UP', { 
      user: mapSupabaseUser(data.user),
      session: data.session
    });
    
    return mapSupabaseUser(data.user);
  },
  
  // Sign out method
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    eventEmitter.emit('SIGNED_OUT', {});
    
    return true;
  },
  
  // User profile methods
  updateUserProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;

    eventEmitter.emit('PROFILE_UPDATED', { 
      user: await authBridge.getUser(),
      profile: data
    });
    
    return data;
  },
  
  // Password methods
  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    
    if (error) throw error;
    
    return true;
  },
  
  updatePassword: async (newPassword) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    
    eventEmitter.emit('PASSWORD_UPDATED', {});
    
    return true;
  },
  
  // Role and permissions
  hasRole: (requiredRole) => {
    return async () => {
      const user = await authBridge.getUser();
      
      if (!user) return false;
      
      // Get roles from user metadata
      const roles = user.app_metadata?.roles || [];
      
      if (!roles.length) return false;
      
      // Check if user has any of the required roles
      if (Array.isArray(requiredRole)) {
        return requiredRole.some(role => roles.includes(role));
      }
      
      return roles.includes(requiredRole);
    };
  },
  
  // Event methods
  subscribeToAuthEvents: (callback) => {
    const authListener = (event: string, payload: any) => {
      callback(event, payload);
    };

    // Add listeners for all auth events
    eventEmitter.on('SIGNED_IN', (payload) => authListener('SIGNED_IN', payload));
    eventEmitter.on('SIGNED_UP', (payload) => authListener('SIGNED_UP', payload)); 
    eventEmitter.on('SIGNED_OUT', (payload) => authListener('SIGNED_OUT', payload));
    eventEmitter.on('PROFILE_UPDATED', (payload) => authListener('PROFILE_UPDATED', payload));
    eventEmitter.on('PASSWORD_UPDATED', (payload) => authListener('PASSWORD_UPDATED', payload));

    // Set up Supabase auth state change listener
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      const eventName = event.toUpperCase();
      const user = session?.user ? mapSupabaseUser(session.user) : null;
      eventEmitter.emit(eventName, { user, session });
    });

    // Return unsubscribe function
    return () => {
      eventEmitter.removeAllListeners();
      data.subscription.unsubscribe();
    };
  }
};
