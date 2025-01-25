import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/stores/auth/store";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initialize = useAuthStore((state) => state.initialize);
  const initialized = useAuthStore((state) => state.initialized);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!initialized || isLoading) {
    return <div>Loading global auth...</div>;
  }

  return <>{children}</>;
};