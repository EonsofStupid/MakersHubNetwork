
import { ReactNode, useEffect } from "react";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/logging/constants/log-category";
import { useAuthStore } from "@/auth/store/auth.store";
import { AppBootstrap } from "./AppBootstrap";
import { LinkedAccountAlert } from "@/auth/components/LinkedAccountAlert";
import { AccountLinkingModal } from "@/auth/components/AccountLinkingModal";

interface AppInitializerProps {
  children: ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const logger = useLogger("AppInitializer", LogCategory.SYSTEM);
  
  // Use selectors from auth store for better performance
  const status = useAuthStore(state => state.status);
  const initialized = useAuthStore(state => state.initialized);
  
  // Log app initialization status
  useEffect(() => {
    logger.info("App initializing, auth status:", {
      details: {
        status,
        authInitialized: initialized
      },
    });
    
    if (initialized) {
      logger.info("All systems initialized, rendering application");
    }
  }, [status, initialized, logger]);

  return (
    <>
      {/* Add the AppBootstrap component to handle initialization */}
      <AppBootstrap />
      
      {/* Account linking components */}
      <LinkedAccountAlert />
      <AccountLinkingModal />
      
      {/* Render children regardless of initialization status */}
      {children}
    </>
  );
}
