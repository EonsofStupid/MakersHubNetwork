// src/stores/auth/slices/ui.slice.ts

import { StateCreator } from "zustand";
import { AuthState, AuthActions } from "../types/auth.types";

/**
 * UiSlice - the subset of AuthState & AuthActions 
 * that deals with UI concerns (error, status).
 */
export interface UiSlice {
  // From AuthState
  error: AuthState["error"];
  status: AuthState["status"];
  // From AuthActions
  setError: AuthActions["setError"];
  setStatus: AuthActions["setStatus"];
}

/**
 * createUiSlice:
 * A Zustand slice creator that returns only the UI subset.
 */
export const createUiSlice: StateCreator<UiSlice> = (set) => ({
  error: null,
  status: "idle",
  setError: (error) => set({ error }),
  setStatus: (status) => set({ status }),
});
