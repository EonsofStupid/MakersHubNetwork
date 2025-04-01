
# MakersImpulse Admin

This directory contains the admin interface for MakersImpulse, a hub for 3D printer makers.

## Architecture Overview

The admin section follows these architectural principles:

### State Management

We use a dual-approach to state management:

- **Zustand** for global application state
  - Auth state (user, roles, permissions)
  - Admin configuration
  - Settings and preferences

- **Jotai** for component-level state
  - UI visibility toggles 
  - Drag and drop state
  - Sidebar/panel states
  - Component interaction state

This separation allows us to manage global state with persistence, while keeping UI-specific state lightweight and reactive.

### File Structure

- **atoms/** - Jotai atoms for component state
- **components/** - UI components specific to the admin section
- **constants/** - Shared constants and configuration values
- **docs/** - Documentation for the admin system
- **hooks/** - Custom hooks for accessing state and functionality
- **routes/** - Admin route definitions and page components
- **store/** - Zustand stores for global admin state
- **types/** - TypeScript type definitions
- **utils/** - Utility functions and helpers

### Permissions System

Admin permissions are synced from the auth system using the `useAdminPermissions` hook. This ensures that only authorized users can access sensitive functionality.

## Development Guidelines

1. Keep components small and focused
2. Use the state management approach documented in `/docs/state-management.md`
3. Follow TypeScript best practices for type safety
4. Create reusable hooks for accessing functionality
5. Document complex components and business logic

For more details, see the documentation in the `docs/` directory.
