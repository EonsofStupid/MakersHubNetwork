
import { supabase } from "@/integrations/supabase/client";
import { User, Session, PostgrestError } from "@supabase/supabase-js";
import { UserRole } from "../types/auth.types";
import { getLogger } from "@/logging";
import { LogCategory } from "@/logging/types";
import { notifyAuthError, notifySignIn, notifySignOut, notifySessionUpdated } from "../bridge";

const logger = getLogger();

/**
 * Fetch user roles from the database
 */
export const fetchUserRoles = async (userId: string): Promise<UserRole[]> => {
  try {
    const { data: rolesData, error: rolesError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
      
    if (rolesError) throw rolesError;
    
    const roles = (rolesData?.map((r) => r.role) as UserRole[]) || [];
    logger.info("User roles fetched", { 
      category: LogCategory.AUTH,
      source: "SupabaseAuth",
      details: { roles, userId } 
    });
    
    return roles;
  } catch (error) {
    logger.error("Error fetching user roles", {
      category: LogCategory.AUTH,
      source: "SupabaseAuth",
      details: error
    });
    return [];
  }
};

/**
 * Get the current session
 */
export const getSession = async (): Promise<Session | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    logger.error("Error getting session", {
      category: LogCategory.AUTH,
      source: "SupabaseAuth",
      details: error
    });
    return null;
  }
};

/**
 * Initialize auth and set up listeners
 */
export const setupAuthListeners = () => {
  logger.info("Setting up auth listeners", { 
    category: LogCategory.AUTH,
    source: "SupabaseAuth"
  });
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    logger.info(`Auth state changed: ${event}`, { 
      category: LogCategory.AUTH,
      source: "SupabaseAuth",
      details: { event }
    });
    
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      if (session?.user) {
        const roles = await fetchUserRoles(session.user.id);
        notifySignIn({ session, user: session.user, roles });
      }
    } else if (event === 'SIGNED_OUT') {
      notifySignOut();
    } else if (event === 'USER_UPDATED') {
      notifySessionUpdated(session);
    }
  });
  
  return () => {
    subscription.unsubscribe();
  };
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    return { user: data.user, error: null };
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    notifyAuthError(errorMessage);
    return { user: null, error: errorMessage };
  }
};

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    
    return { user: data.user, error: null };
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    notifyAuthError(errorMessage);
    return { user: null, error: errorMessage };
  }
};

/**
 * Sign out
 */
export const signOut = async (): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    notifyAuthError(errorMessage);
    return { error: errorMessage };
  }
};
