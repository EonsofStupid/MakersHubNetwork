
import { StateCreator } from "zustand";
import { AuthState, AuthActions } from "@/auth/store/auth.store";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

export const createSessionSlice: StateCreator<
  AuthState & AuthActions,
  [],
  [],
  Pick<AuthState, "session" | "initialized"> & Pick<AuthActions, "setSession" | "setInitialized">
> = (set, get, _store) => ({
  session: null,
  initialized: false,
  setSession: (session) => set({ session }),
  setInitialized: (initialized) => set({ initialized }),
});
