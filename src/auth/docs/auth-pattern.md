
# Authentication Pattern in MakersImpulse

This document outlines the authentication approach used in the MakersImpulse application.

## Core Architecture

1. **Auth Store (Zustand)**
   - Defined in `src/auth/store/auth.store.ts`
   - Single source of truth for authentication state
   - Manages user, session, roles, and auth status

2. **Auth Bridge**
   - Defined in `src/auth/bridge.ts`
   - Provides a pub/sub mechanism for auth events
   - Allows components to react to auth state changes

3. **RBAC (Role-Based Access Control)**
   - Defined in `src/auth/rbac/` directory
   - Maps roles to permissions
   - Provides utility functions for permission checks

## State Management

The auth store maintains the following state:

- `user`: The current authenticated user (or null)
- `session`: The current auth session (or null)
- `roles`: Array of user roles
- `status`: Authentication status ('idle', 'loading', 'authenticated', 'unauthenticated')
- `isLoading`: Loading state flag
- `error`: Any authentication errors

## Authentication Flow

1. **Initialization**
   - On app start, `initialize()` is called
   - Checks for existing session and sets user state
   - Sets up auth state change listener

2. **Login/Signup**
   - Handled by Supabase auth methods
   - Auth store is updated via auth state change listener

3. **Session Management**
   - Session refresh is handled automatically
   - Session state is persisted in localStorage

4. **Logout**
   - Calls Supabase signOut method
   - Clears auth store state

## Access Control

1. **Role-Based**
   - User roles are stored in the `user_roles` table
   - Roles are loaded during authentication
   - Accessible via `useAuthStore().roles`

2. **Permission-Based**
   - Permissions are defined in `src/auth/permissions.ts`
   - Roles map to permissions in RBAC system
   - Admin permissions are a subset of app permissions

3. **UI Protection**
   - Admin routes are protected by `AdminAuthGuard`
   - UI elements are conditionally rendered based on permissions
   - Permission checks are provided by `useAdminPermissions` hook

## Auth-Related Hooks

1. **useAuth**
   - General-purpose auth hook
   - Provides auth state and methods

2. **useAuthState**
   - Direct access to auth store
   - Used for granular control

3. **useAdminAccess**
   - Determines if user has admin access
   - Used for admin route protection

4. **useAdminPermissions**
   - Checks specific admin permissions
   - Used for conditional UI rendering

## Auth Events

The auth bridge emits the following events:

- `AUTH_SIGNED_IN`: User has signed in
- `AUTH_SIGNED_OUT`: User has signed out
- `AUTH_STATE_CHANGED`: Auth state has changed
- `AUTH_SESSION_REFRESH`: Session has been refreshed
- `AUTH_USER_UPDATED`: User data has been updated
- `AUTH_ROLES_UPDATED`: User roles have been updated

## Best Practices

1. **Never store sensitive data** in the auth store beyond what's needed
2. **Always use the auth hooks** rather than directly accessing the store
3. **Handle loading and error states** in UI components
4. **Use permission checks** rather than role checks for access control
5. **Subscribe to auth events** for components that need to react to auth changes
