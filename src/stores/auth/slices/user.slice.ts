
import { StateCreator } from "zustand";
import { AuthState, AuthActions, AuthStore, AuthStatus } from "../types/auth.types";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { AuthStateSchema } from "../schemas/state.schema";

export const createUserSlice: StateCreator<
  AuthState & AuthActions,
  [],
  [],
  Pick<AuthState, "user" | "roles"> & Pick<AuthActions, "setUser" | "setRoles">
> = (set, get, _store) => ({
  user: null,
  roles: [],
  setUser: (user) => set({ user }),
  setRoles: (roles) => set({ roles }),
});
