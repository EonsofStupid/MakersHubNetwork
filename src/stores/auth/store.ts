
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { AuthStore } from "./types/auth.types"
import { createAuthSlice } from "./slices/auth.slice"
import { createUiSlice } from "./slices/ui.slice"

export const useAuthStore = create<AuthStore>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createUiSlice(...a),
      isLoading: false,
      initialized: false,
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        roles: state.roles,
      }),
    }
  )
)
