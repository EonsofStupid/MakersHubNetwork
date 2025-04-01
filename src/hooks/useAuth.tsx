
import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { UserRole } from "@/types/auth.types";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/logging";

// Create a context for authentication
interface AuthContextType {
  user: User | null;
  session: Session | null;
  roles: UserRole[];
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  isLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  hasRole: (role: UserRole) => boolean;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "authenticated" | "unauthenticated">("idle");
  const [isLoading, setIsLoading] = useState(true);
  const logger = useLogger("AuthProvider", LogCategory.AUTH);

  const hasRole = (role: UserRole) => roles.includes(role);
  const isAdmin = roles.includes("admin") || roles.includes("super_admin");
  const isSuperAdmin = roles.includes("super_admin");
  
  // Initialize auth state
  const initialize = async () => {
    try {
      setIsLoading(true);
      setStatus("loading");
      logger.info("Initializing auth state");
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      if (session?.user?.id) {
        logger.info("User session found", { details: { userId: session.user.id } });
        
        // Fetch roles from user_roles table
        const { data: rolesData, error: rolesError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id);
          
        if (rolesError) throw rolesError;

        const userRoles = (rolesData?.map((r) => r.role) as UserRole[]) || [];
        logger.info("User roles fetched", { details: { roles: userRoles } });
        
        setUser(session.user);
        setSession(session);
        setRoles(userRoles);
        setStatus("authenticated");
      } else {
        logger.info("No user session found");
        setUser(null);
        setSession(null);
        setRoles([]);
        setStatus("unauthenticated");
      }
    } catch (err) {
      logger.error("Auth initialization error", { details: err });
      setUser(null);
      setSession(null);
      setRoles([]);
      setStatus("unauthenticated");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      setIsLoading(true);
      logger.info("Logging out user");
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setRoles([]);
      setStatus("unauthenticated");
      logger.info("User logged out successfully");
    } catch (err) {
      logger.error("Logout error", { details: err });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial load of auth state
    initialize();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      logger.info("Auth state changed", { details: { event: _event } });
      
      // Don't call initialize here to prevent circular calls
      if (session) {
        setUser(session.user);
        setSession(session);
        setStatus("authenticated");
        
        // Fetch roles separately with setTimeout to avoid deadlocks
        if (session.user) {
          setTimeout(async () => {
            try {
              const { data: rolesData, error: rolesError } = await supabase
                .from("user_roles")
                .select("role")
                .eq("user_id", session.user.id);
                
              if (rolesError) throw rolesError;
              
              const userRoles = (rolesData?.map((r) => r.role) as UserRole[]) || [];
              logger.info("User roles updated after auth state change", { details: { roles: userRoles } });
              setRoles(userRoles);
            } catch (err) {
              logger.error("Error fetching roles after auth state change", { details: err });
            }
          }, 0);
        }
      } else {
        setUser(null);
        setSession(null);
        setRoles([]);
        setStatus("unauthenticated");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [logger]);

  const value = {
    user,
    session,
    roles,
    status,
    isLoading,
    isAdmin,
    isSuperAdmin,
    hasRole,
    logout,
    initialize
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
