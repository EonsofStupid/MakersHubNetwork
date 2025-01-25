import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/stores/auth/store";

/**
 * AuthProvider
 *
 * A simple wrapper to ensure the auth store is initialized exactly once.
 * It no longer fetches sessions or listens to onAuthStateChange directly;
 * the store does that internally.
 *
 * Optionally, you can display a global loading spinner if store.isLoading is true.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initialize = useAuthStore((state) => state.initialize);
  const isInitialized = useAuthStore((state) => state.initialized);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  // Show a global loading indicator until we've done at least one session check
  if (!isInitialized || isLoading) {
    return <div>Loading auth...</div>;
  }

  return <>{children}</>;
};
