
# State Management in MakersImpulse

This document outlines our state management approach to ensure consistency and maintainability.

## Core Principles

1. **Zustand for Global State**
   - Used for application-wide state that persists across navigation
   - Examples: authentication, user preferences, global settings
   - Located in `src/stores/` and `src/admin/store/`

2. **Jotai for Component State**
   - Used for UI state that is shared between components
   - Examples: modal state, sidebar visibility, drag and drop state
   - Located in `src/admin/atoms/`

3. **React useState for Local Component State**
   - Used for state that is specific to a single component
   - Examples: form inputs, toggles, local UI state

## State Organization

### Auth State
- Global auth state is managed via Zustand in `src/auth/store/auth.store.ts`
- Auth events are published through the bridge in `src/auth/bridge.ts`

### Admin State
- Admin permissions and settings are managed in `src/admin/store/admin.store.ts`
- Admin UI component state is managed with Jotai atoms in `src/admin/atoms/`

### UI State
- Global UI preferences are managed in `src/stores/ui/store.ts`
- Component-specific UI state uses Jotai atoms

## Best Practices

1. **State Access**
   - Use custom hooks to access state (e.g., `useAuth`, `useAdminPermissions`)
   - Never access store directly from components

2. **State Updates**
   - Use the store's actions to update state
   - Keep state updates simple and atomic

3. **State Persistence**
   - Use persist middleware for state that should persist across sessions
   - Be mindful of what state is persisted (don't persist sensitive data)

4. **Performance**
   - Use selectors to prevent unnecessary re-renders
   - Memoize derived state with useMemo

5. **Type Safety**
   - Define proper TypeScript interfaces for all state
   - Use strict typing for state access and updates

## File Structure

- **Global Stores**: `src/stores/{feature}/store.ts`
- **Admin Store**: `src/admin/store/{feature}.store.ts`
- **Component Atoms**: `src/admin/atoms/{feature}.atoms.ts`
- **Custom Hooks**: `src/hooks/use{Feature}.ts` or `src/admin/hooks/use{Feature}.ts`

## Migration Plan

We're currently in the process of aligning all state management with these principles.
This includes:

1. Moving component state to Jotai atoms
2. Consolidating global state in Zustand stores
3. Creating clear boundaries between global and component state
4. Improving type safety and documentation
