
// Import directly rather than using dynamic import
import { UserRole, ROLES } from './shared.types';

// Re-export for backward compatibility
export type { UserRole };
export { ROLES };

// Type compatibility aliases for backward compatibility
export type UserRoleType = UserRole;
export const UserRoleEnum = ROLES;
