import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { devtools, subscribeWithSelector } from "zustand/middleware";

import { createAuthSlice } from "./slices/auth.slice";
import { authStorage } from "./middleware/persist.middleware";
import { AuthStore } from "./types/auth.types";

// Create the store with proper middleware chain
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      subscribeWithSelector((...args) => ({
        ...createAuthSlice(...args),
      })),
      {
        name: "auth-storage",
        storage: createJSONStorage(() => authStorage),
        partialize: (state) => ({
          user: state.user,
          session: state.session,
          roles: state.roles,
          status: state.status,
        }),
      }
    ),
    {
      name: "AuthStore",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

// Initialize the store
useAuthStore.getState().initialize();

// Debug subscriptions in development
if (process.env.NODE_ENV === "development") {
  useAuthStore.subscribe(
    (state) => state,
    (state) =>
      console.log("Auth State Updated:", {
        userId: state.user?.id,
        status: state.status,
        roles: state.roles,
        isLoading: state.isLoading,
        error: state.error,
        timestamp: new Date().toISOString(),
      })
  );
}