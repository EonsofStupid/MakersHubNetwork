Type System Issues (197 errors):
Incorrect UI component imports (using @/components instead of @/shared/ui)
Missing or incorrect type definitions
Inconsistent enum/literal type usage
Store type mismatches
Path Resolution Issues:
Multiple instances of incorrect import paths
Missing module declarations
Circular dependencies
Store Implementation Issues:
Store API call signature errors
Missing store methods
Incorrect state management patterns
Let me create a manifest.md to guide us:


# Enterprise Codebase Manifest

## Core Principles
1. Single Source of Truth
2. Type Safety First
3. Consistent Import Structure
4. Explicit Type Literals
5. No Implicit Any
6. No Type Duplication

## Type System
1. String Literal Types
```typescript
export type AuthStatus = 'AUTHENTICATED' | 'LOADING' | 'UNAUTHENTICATED';
export type BuildStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN_REVIEW';
export type UserRole = 'ADMIN' | 'USER' | 'MODERATOR' | 'SUPERADMIN';
Component Props

export interface ThemeEffectProps {
  effect: ThemeEffect;
  children: ReactNode;
}
Store States

export interface ThemeState {
  themes: Theme[];
  componentTokens: ComponentTokens;
  activeTheme: string;
}
Import Structure
UI Components
All UI imports from @/shared/ui/*
No direct imports from @/components
Explicit named exports
Types
All types from @/shared/types/*
No inline type definitions
No duplicate type definitions
Utilities
All utilities from @/shared/utils/*
Pure functions only
Strong type signatures
Store Implementation
Type-Safe Store Creation

export interface Store<T> {
  getState: () => T;
  setState: (partial: Partial<T>) => void;
  subscribe: (listener: () => void) => () => void;
}
Strict Action Types

export type Action = 
  | { type: 'UPDATE_THEME'; payload: Theme }
  | { type: 'SET_STATUS'; payload: AuthStatus };
Path Resolution
Absolute Imports
Use @/ prefix for all imports
No relative paths beyond one level
Clear module boundaries
Module Structure
/shared
  /types
  /ui
  /utils
  /store
/features
  /auth
  /theme
  /admin
Error Handling
Type-Safe Error Types

export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};
Error Boundaries
Per-feature error boundaries
Type-safe error props
Consistent error handling patterns

The next phase will involve:

1. Type System Overhaul:
- Move ALL types to shared/types/*
- Convert ALL enums to literal types
- Enforce strict type checking

2. Import Restructuring:
- Move ALL UI components to shared/ui
- Update ALL import paths
- Remove duplicate exports

3. Store Refactoring:
- Fix store implementation patterns
- Add proper type signatures
- Correct state management

4. Path Resolution:
- Update tsconfig paths
- Fix module resolution
- Clean up circular dependencies