
/**
 * auth/types/auth.types.ts
 * 
 * Core authentication type definitions
 */

import { User, Session } from '@supabase/supabase-js';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export interface AuthUser extends User {
  // Any additional properties needed for the user object
}

export interface AuthSession extends Session {
  // Any additional properties needed for the session object
}
