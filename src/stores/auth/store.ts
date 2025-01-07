import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthState } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { devtools } from "zustand/middleware";

const initialState = {
  user: null,
  session: null,
  roles: [],
  isLoading: true,
  error: null,
  initialized: false,
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setUser: (user) => set({ user }),
        setSession: (session) => set({ session }),
        setRoles: (roles) => set({ roles }),
        setError: (error) => set({ error }),
        setLoading: (isLoading) => set({ isLoading }),
        setInitialized: (initialized) => set({ initialized }),
        logout: async () => {
          try {
            await supabase.auth.signOut();
            set(initialState);
          } catch (error) {
            set({ error: (error as Error).message });
          }
        },
      }),
      {
        name: "auth-storage",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);