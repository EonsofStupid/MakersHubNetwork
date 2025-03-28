
import { StateCreator } from "zustand"
import { AuthStore } from "../types/auth.types"

export const createUiSlice: StateCreator<
  AuthStore,
  [],
  [],
  Pick<AuthStore, "error" | "setError">
> = (set) => ({
  error: null,
  setError: (error) => set({ error }),
})
