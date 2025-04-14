
// Re-export from shared.types.ts
export * from './shared.types';

// Type compatibility aliases for backward compatibility with existing code
export type UserRoleType = import('./shared.types').UserRole;
export const UserRoleEnum = import('./shared.types').ROLES;
