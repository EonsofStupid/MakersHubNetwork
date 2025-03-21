
import { StateCreator } from "zustand"
import { AuthState, AuthActions } from "../types/auth.types"

export const createUiSlice: StateCreator<
  AuthState & AuthActions,
  [],
  [],
  Pick<AuthState, "error"> & Pick<AuthActions, "setError">
> = (set) => ({
  error: null,
  setError: (error) => set({ error }),
})
