
import { z } from 'zod';
import { UserRole, AuthStatus } from '@/types/shared';

/**
 * Auth store state validation schema
 */
export const AuthStateSchema = z.object({
  user: z.any().nullable(),
  session: z.any().nullable(),
  profile: z.object({
    id: z.string(),
    user_id: z.string(),
    display_name: z.string().optional(),
    avatar_url: z.string().optional(),
    bio: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
  }).nullable(),
  roles: z.array(z.custom<UserRole>()),
  status: z.custom<AuthStatus>(),
  isAuthenticated: z.boolean(),
  isLoading: z.boolean(),
  error: z.string().nullable(),
  initialized: z.boolean()
});

export type AuthStoreState = z.infer<typeof AuthStateSchema>;
