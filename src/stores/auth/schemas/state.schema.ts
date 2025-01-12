import { z } from "zod";
import { User, Session } from "@supabase/supabase-js";

export const UserRoleSchema = z.enum(['admin', 'editor', 'viewer']);

export const AuthStatusSchema = z.enum([
  'idle',
  'loading',
  'authenticated',
  'unauthenticated'
]);

export const AuthStateSchema = z.object({
  user: z.custom<User>().nullable(),
  session: z.custom<Session>().nullable(),
  roles: z.array(UserRoleSchema),
  status: AuthStatusSchema,
  error: z.string().nullable(),
  initialized: z.boolean()
});

export type AuthStateSchemaType = z.infer<typeof AuthStateSchema>;