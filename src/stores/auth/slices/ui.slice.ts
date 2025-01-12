import { StateCreator } from "zustand";
import { AuthState, AuthActions } from "../types/auth.types";

export const createUiSlice: StateCreator<
  AuthState & AuthActions,
  [],
  [],
  Pick<AuthState, "isLoading" | "error"> & Pick<AuthActions, "setLoading" | "setError">
> = (set) => ({
  isLoading: true,
  error: null,
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
});