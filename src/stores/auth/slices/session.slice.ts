import { StateCreator } from "zustand";
import { AuthState, AuthActions } from "../types/auth.types";

export const createSessionSlice: StateCreator<
  AuthState & AuthActions,
  [],
  [],
  Pick<AuthState, "session" | "initialized"> & Pick<AuthActions, "setSession" | "setInitialized">
> = (set) => ({
  session: null,
  initialized: false,
  setSession: (session) => set({ session }),
  setInitialized: (initialized) => set({ initialized }),
});