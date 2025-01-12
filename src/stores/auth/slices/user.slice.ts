import { StateCreator } from "zustand";
import { AuthState, AuthActions } from "../types/auth.types";

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