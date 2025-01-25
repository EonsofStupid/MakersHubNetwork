import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { persist, createJSONStorage } from "zustand/middleware";

import { createAuthSlice } from "./slices/auth.slice";
import { authStorage } from "./middleware/persist.middleware";
import { AuthStore } from "./types/auth.types";

/**
 * useAuthStore
 *
 * A single store that merges slices if needed.
 * We wrap it in devtools + persist if we want.
 */
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      subscribeWithSelector((...a) => ({
        ...createAuthSlice(...a),
      })),
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
      name: "AuthStore",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

// Debug subscription in development
if (process.env.NODE_ENV === "development") {
  useAuthStore.subscribe(
    (state) => state,
    (state) => console.log("Auth State Updated:", state)
  );
}
