import { AuthStore, UserRole } from "../types/auth.types"

// Basic selectors
export const selectUser = (state: AuthStore) => state.user
export const selectSession = (state: AuthStore) => state.session
export const selectRoles = (state: AuthStore) => state.roles
export const selectStatus = (state: AuthStore) => state.status
export const selectError = (state: AuthStore) => state.error
export const selectIsLoading = (state: AuthStore) => state.isLoading
export const selectIsInitialized = (state: AuthStore) => state.initialized

// Derived selectors
export const selectIsAuthenticated = (state: AuthStore) =>
  state.status === "authenticated"

export const selectIsAdmin = (state: AuthStore) =>
  state.roles.includes("admin")

export const selectHasRole =
  (role: UserRole) =>
  (state: AuthStore) =>
    state.roles.includes(role)