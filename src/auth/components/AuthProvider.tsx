
import { ReactNode, useEffect } from "react";
import { setupAuthListeners } from "../providers/supabase-auth";
import { getLogger } from "@/logging";
import { LogCategory } from "@/logging/types";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component that sets up authentication listeners
 * and provides the current authentication state to the app
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const logger = getLogger();

  // Set up auth listeners on component mount
  useEffect(() => {
    logger.info("Setting up auth provider", {
      category: LogCategory.AUTH,
      source: "AuthProvider"
    });
    
    const unsubscribeAuthListeners = setupAuthListeners();
    
    return () => {
      logger.info("Cleaning up auth provider", {
        category: LogCategory.AUTH,
        source: "AuthProvider"
      });
      unsubscribeAuthListeners();
    };
  }, [logger]);

  return <>{children}</>;
};

export default AuthProvider;
