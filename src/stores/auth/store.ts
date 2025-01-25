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
  // State changes subscription
  useAuthStore.subscribe(
    (state) => state,
    (state) => console.log("Auth State Updated:", {
      userId: state.user?.id,
      status: state.status,
      roles: state.roles,
      isLoading: state.isLoading,
      error: state.error,
      timestamp: new Date().toISOString()
    })
  );

  // Role changes subscription
  useAuthStore.subscribe(
    (state) => state.roles,
    (roles) => console.log("User Roles Updated:", {
      roles,
      timestamp: new Date().toISOString()
    })
  );

  // Error state subscription
  useAuthStore.subscribe(
    (state) => state.error,
    (error) => {
      if (error) {
        console.error("Auth Error:", {
          error,
          timestamp: new Date().toISOString()
        });
      }
    }
  );

  // Session expiry monitoring
  useAuthStore.subscribe(
    (state) => state.session?.expires_at,
    (expiresAt) => {
      if (expiresAt) {
        const timeToExpiry = new Date(expiresAt).getTime() - Date.now();
        console.log("Session Expiry Status:", {
          expiresAt,
          timeToExpiryMs: timeToExpiry,
          timeToExpiryMinutes: Math.round(timeToExpiry / 1000 / 60),
          timestamp: new Date().toISOString()
        });
      }
    }
  );
}