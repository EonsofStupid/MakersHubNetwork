
/**
 * Auth state schema
 * 
 * Zod schema for auth state validation
 */
import { z } from 'zod';
import { UserRole, ROLES, AuthStatus } from '@/types/shared';

// Simple user schema
const UserSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  user_metadata: z.record(z.any()).optional(),
  app_metadata: z.record(z.any()).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});

// Auth state schema
export const AuthStateSchema = z.object({
  user: UserSchema.nullable(),
  session: z.any().nullable(),
  profile: z.object({
    id: z.string(),
    user_id: z.string(),
    display_name: z.string().optional(),
    avatar_url: z.string().optional()
  }).nullable(),
  roles: z.array(z.string() as z.ZodType<UserRole>),
  status: z.enum(['idle', 'loading', 'authenticated', 'unauthenticated', 'error']),
  isAuthenticated: z.boolean(),
  isLoading: z.boolean(),
  error: z.string().nullable()
});
