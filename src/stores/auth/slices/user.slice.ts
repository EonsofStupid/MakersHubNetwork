
import { StateCreator } from "zustand";
import { AuthState, AuthStore } from "../types/auth.types";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { AuthStateSchema } from "../schemas/state.schema";

export const createUserSlice: StateCreator<
  AuthState,
  [],
  [],
  Pick<AuthState, "user" | "roles"> & {
    setUser: (user: AuthState["user"]) => void;
    setRoles: (roles: AuthState["roles"]) => void;
  }
> = (set, get, _store) => ({
  user: null,
  roles: [],
  setUser: (user) => set({ user }),
  setRoles: (roles) => set({ roles }),
});
