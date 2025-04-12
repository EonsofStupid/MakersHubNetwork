
// This file is a re-export to avoid duplication
// We're re-exporting Auth types from shared.types.ts

import type { AuthStatus, AuthEvent, AuthEventType, User, UserProfile, UserRole } from './shared.types';

// Re-export all auth types
export type { AuthStatus, AuthEvent, AuthEventType, User, UserProfile, UserRole };
