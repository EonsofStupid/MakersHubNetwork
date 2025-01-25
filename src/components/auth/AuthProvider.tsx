import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/stores/auth/store";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initialize = useAuthStore((state) => state.initialize);
  const initialized = useAuthStore((state) => state.initialized);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    // Kick off the store’s initialize logic once.
    // If you haven't already done so in store.ts
    // Or if you want it repeated on app mount, do it here.
    initialize();
  }, [initialize]);

  if (!initialized || isLoading) {
    return <div>Loading global auth...</div>;
  }

  return <>{children}</>;
};
