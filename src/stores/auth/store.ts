import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createUserSlice } from "./slices/user.slice";
import { createSessionSlice } from "./slices/session.slice";
import { createUiSlice } from "./slices/ui.slice";
import { authStorage } from "./middleware/persist.middleware";
import { AuthStore } from "./types/auth.types";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { supabase } from "@/integrations/supabase/client";

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      subscribeWithSelector((set, get, store) => ({
        ...createUserSlice(set, get, store),
        ...createSessionSlice(set, get, store),
        ...createUiSlice(set, get, store),
        hasRole: (role) => get().roles.includes(role),
        isAdmin: () => get().roles.includes('admin'),
        clearState: () => {
          set({
            user: null,
            session: null,
            roles: [],
            error: null,
            isLoading: false,
            initialized: true,
          });
        },
        logout: async () => {
          try {
            await supabase.auth.signOut();
            set({
              user: null,
              session: null,
              roles: [],
              error: null,
              isLoading: false,
              initialized: true,
            });
          } catch (error) {
            set({ error: (error as Error).message });
          }
        },
      })),
      {
        name: "auth-storage",
        storage: authStorage,
        partialize: (state) => ({
          user: state.user,
          session: state.session,
          roles: state.roles,
        }),
      }
    )
  )
);

// Debug subscription in development
if (process.env.NODE_ENV === "development") {
  useAuthStore.subscribe(
    (state) => state,
    (state) => console.log("Auth State Updated:", state)
  );
}