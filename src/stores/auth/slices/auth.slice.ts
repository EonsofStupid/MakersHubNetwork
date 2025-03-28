
import { StateCreator } from "zustand";
import { AuthSlice, AuthStore } from "../types/auth.types";

export const createAuthSlice: StateCreator<AuthStore, [], [], AuthSlice> = (
  set,
  get
) => ({
  status: "loading",
  session: null,
  user: null,
  roles: [],
  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  setRoles: (roles) => set({ roles }),
  clearUser: () => set({ user: null, session: null, roles: [], status: "unauthenticated" }),
  setStatus: (status) => set({ status }),
  isAdmin: () => {
    const { roles } = get();
    return roles.includes('admin') || roles.includes('super_admin');
  }
});
