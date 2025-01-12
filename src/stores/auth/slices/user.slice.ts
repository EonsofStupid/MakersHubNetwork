import { StateCreator } from "zustand";
import { AuthState, AuthActions } from "../types/auth.types";
import { supabase } from "@/integrations/supabase/client";

export const createUserSlice: StateCreator<
  AuthState & AuthActions,
  [],
  [],
  Pick<AuthState, "user" | "roles"> & Pick<AuthActions, "setUser" | "setRoles">
> = (set) => ({
  user: null,
  roles: [],
  setUser: (user) => set({ user }),
  setRoles: (roles) => set({ roles }),
});