
// Re-export from shared.types.ts directly, not as a promise
export * from './shared.types';

// Type compatibility aliases for backward compatibility
export type UserRoleType = import('./shared.types').UserRole;
export const UserRoleEnum = import('./shared.types').ROLES;
