import { StateCreator } from "zustand";
import { AuthState, AuthActions } from "../types/auth.types";

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