import { StateCreator } from "zustand";
import { AuthState, AuthActions, AuthStore, AuthStatus } from "../types/auth.types";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { AuthStateSchema } from "../schemas/state.schema";

export const createUiSlice: StateCreator<
  AuthState & AuthActions,
  [],
  [],
  Pick<AuthState, "error" | "status"> & Pick<AuthActions, "setError" | "setStatus">
> = (set, get, _store) => ({
  error: null,
  status: 'idle',
  setError: (error) => set({ error }),
  setStatus: (status) => set({ status }),
});