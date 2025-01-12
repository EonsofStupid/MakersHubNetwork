import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createAuthSlice } from "./slices/auth.slice";
import { authStorage } from "./middleware/persist.middleware";
import { AuthStore } from "./types/auth.types";
import { devtools, subscribeWithSelector } from "zustand/middleware";

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        (...args) => ({
          ...createAuthSlice(...args),
        })
      ),
      {
        name: "auth-storage",
        storage: authStorage,
        partialize: (state) => ({
          user: state.user,
          session: state.session,
          roles: state.roles,
          status: state.status,
        }),
      }
    ),
    {
      name: 'AuthStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// Initialize auth state when the store is created
useAuthStore.getState().initialize();

// Debug subscription in development
if (process.env.NODE_ENV === "development") {
  useAuthStore.subscribe(
    (state) => state,
    (state) => console.log("Auth State Updated:", state)
  );
}