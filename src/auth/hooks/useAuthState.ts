
import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { UserRole, AuthStatus } from "../types/auth.types";
import { subscribeToAuthEvents } from "../bridge";
import { getSession, fetchUserRoles } from "../providers/supabase-auth";
import { getLogger } from "@/logging";
import { LogCategory } from "@/logging/types";

/**
 * Custom hook that provides the current authentication state
 */
export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  
  const logger = getLogger();

  const isAuthenticated = status === "authenticated";
  const isAdmin = roles.includes("admin") || roles.includes("super_admin");
  const isSuperAdmin = roles.includes("super_admin");
  
  // Function to check if user has a specific role
  const hasRole = (role: UserRole) => roles.includes(role);

  // Initialize auth state on component mount
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        setStatus("loading");
        logger.info("Initializing auth state", { 
          category: LogCategory.AUTH,
          source: "useAuthState" 
        });
        
        // Get current session
        const currentSession = await getSession();
        
        if (currentSession?.user) {
          logger.info("User session found", { 
            category: LogCategory.AUTH,
            source: "useAuthState", 
            details: { userId: currentSession.user.id }
          });
          
          // Fetch user roles
          const userRoles = await fetchUserRoles(currentSession.user.id);
          
          // Update state
          setUser(currentSession.user);
          setSession(currentSession);
          setRoles(userRoles);
          setStatus("authenticated");
        } else {
          logger.info("No user session found", { 
            category: LogCategory.AUTH, 
            source: "useAuthState"
          });
          
          setUser(null);
          setSession(null);
          setRoles([]);
          setStatus("unauthenticated");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        logger.error("Auth initialization error", { 
          category: LogCategory.AUTH,
          source: "useAuthState", 
          details: err 
        });
        
        setError(errorMessage);
        setUser(null);
        setSession(null);
        setRoles([]);
        setStatus("unauthenticated");
      } finally {
        setIsLoading(false);
        setInitialized(true);
      }
    };
    
    initialize();
  }, [logger]);
  
  // Subscribe to auth events
  useEffect(() => {
    const unsubscribe = subscribeToAuthEvents((event) => {
      logger.info(`Auth event received: ${event.type}`, { 
        category: LogCategory.AUTH,
        source: "useAuthState", 
        details: { eventType: event.type }
      });
      
      switch (event.type) {
        case "AUTH_SIGNED_IN":
          setUser(event.payload?.user || null);
          setSession(event.payload?.session || null);
          setRoles(event.payload?.roles || []);
          setStatus("authenticated");
          break;
          
        case "AUTH_SIGNED_OUT":
          setUser(null);
          setSession(null);
          setRoles([]);
          setStatus("unauthenticated");
          break;
          
        case "AUTH_USER_UPDATED":
          setUser(event.payload?.user || null);
          break;
          
        case "AUTH_SESSION_UPDATED":
          setSession(event.payload?.session || null);
          break;
          
        case "AUTH_ERROR":
          setError(event.payload?.error || null);
          break;
      }
    });
    
    return () => unsubscribe();
  }, [logger]);
  
  return {
    user,
    session,
    roles,
    status,
    isLoading,
    error,
    initialized,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    hasRole
  };
};
