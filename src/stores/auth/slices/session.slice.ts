
import { StateCreator } from "zustand";
import { AuthState, AuthStore } from "../types/auth.types";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { AuthStateSchema } from "../schemas/state.schema";

export const createSessionSlice: StateCreator<
  AuthState,
  [],
  [],
  Pick<AuthState, "session" | "initialized"> & {
    setSession: (session: AuthState["session"]) => void;
    setInitialized: (initialized: boolean) => void;
  }
> = (set, get, _store) => ({
  session: null,
  initialized: false,
  setSession: (session) => set({ session }),
  setInitialized: (initialized) => set({ initialized }),
});
