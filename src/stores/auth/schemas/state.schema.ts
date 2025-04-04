
import { z } from "zod";
import { User, Session } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";
import { AuthStatus } from "@/auth/types/auth.types";

// Define the UserRole enum schema based on Supabase types
export const UserRoleSchema = z.enum(['admin', 'editor', 'viewer'] as const);
export type UserRole = z.infer<typeof UserRoleSchema>;

// Define the AuthStatus enum schema
export const AuthStatusSchema = z.enum([
  AuthStatus.LOADING,
  AuthStatus.AUTHENTICATED,
  AuthStatus.UNAUTHENTICATED,
  AuthStatus.ERROR
] as const);

// Define the base state schema
export const AuthStateSchema = z.object({
  user: z.custom<User>().nullable(),
  session: z.custom<Session>().nullable(),
  roles: z.array(UserRoleSchema),
  status: AuthStatusSchema,
  error: z.string().nullable(),
  initialized: z.boolean(),
});

export type AuthStateSchemaType = z.infer<typeof AuthStateSchema>;
