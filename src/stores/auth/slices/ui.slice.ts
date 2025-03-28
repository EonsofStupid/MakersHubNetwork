
import { StateCreator } from "zustand"
import { AuthStore, UiSlice } from "../types/auth.types"

export const createUiSlice: StateCreator<
  AuthStore,
  [],
  [],
  UiSlice
> = (set) => ({
  error: null,
  setError: (error) => set({ error }),
})
