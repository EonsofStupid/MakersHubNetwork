
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "../types/auth.types";
import { notifyAuthError, notifySignIn, notifySignOut, notifySessionUpdated } from "../bridge";

// Get the current session
export async function getSession(): Promise<Session | null> {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      notifyAuthError(error.message);
      throw error;
    }
    
    return data.session;
  } catch (error) {
    console.error("Error retrieving session:", error);
    throw error;
  }
}

// Sign in with email and password
export async function signInWithEmailPassword(email: string, password: string): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      notifyAuthError(error.message);
      throw error;
    }
    
    if (data.session && data.user) {
      // Get roles for the user (this would typically come from your database)
      const roles = await fetchUserRoles(data.user.id);
      
      // Notify auth state changed
      notifySignIn(data.user, data.session, roles);
    }
    
    return data.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}

// Sign out
export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      notifyAuthError(error.message);
      throw error;
    }
    
    notifySignOut();
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

// Fetch user roles from database
export async function fetchUserRoles(userId: string): Promise<UserRole[]> {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error fetching user roles:", error);
      return [];
    }
    
    return data.map(item => item.role as UserRole);
  } catch (error) {
    console.error("Error fetching user roles:", error);
    return [];
  }
}

// Refresh session
export async function refreshSession(): Promise<Session | null> {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      notifyAuthError(error.message);
      throw error;
    }
    
    if (data.session) {
      notifySessionUpdated(data.session);
    }
    
    return data.session;
  } catch (error) {
    console.error("Error refreshing session:", error);
    throw error;
  }
}
