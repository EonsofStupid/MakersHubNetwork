import { z } from "zod";
import { profileSchema } from "./profile.schema";

export const userRoleSchema = z.enum([
  "user",
  "maker",
  "admin",
  "super_admin"
]);

export type UserRole = z.infer<typeof userRoleSchema>;

export const sessionSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  refresh_token: z.string().optional(),
  user: z.object({
    id: z.string().uuid(),
    aud: z.string(),
    role: z.string(),
    email: z.string().email(),
    email_confirmed_at: z.string().datetime().optional(),
    phone: z.string().optional(),
    confirmation_sent_at: z.string().datetime().optional(),
    confirmed_at: z.string().datetime().optional(),
    last_sign_in_at: z.string().datetime().optional(),
    app_metadata: z.object({
      provider: z.string(),
      providers: z.array(z.string()),
    }),
    user_metadata: z.object({
      avatar_url: z.string().url().optional(),
      email: z.string().email().optional(),
      email_verified: z.boolean().optional(),
      full_name: z.string().optional(),
      iss: z.string().optional(),
      name: z.string().optional(),
      preferred_username: z.string().optional(),
      provider_id: z.string().optional(),
      sub: z.string().optional(),
    }),
    identities: z.array(z.object({
      id: z.string(),
      user_id: z.string(),
      identity_data: z.record(z.string(), z.unknown()),
      provider: z.string(),
      last_sign_in_at: z.string().datetime(),
      created_at: z.string().datetime(),
      updated_at: z.string().datetime(),
    })).optional(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
  }),
});

export type Session = z.infer<typeof sessionSchema>;

// Auth state schema
export const authStateSchema = z.object({
  session: sessionSchema.nullable(),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    user_metadata: z.record(z.string(), z.unknown()),
  }).nullable(),
  profile: profileSchema.nullable(),
  roles: z.array(userRoleSchema),
  status: z.enum(["authenticated", "unauthenticated"]),
  isLoading: z.boolean(),
  error: z.unknown().nullable(),
});

export type AuthState = z.infer<typeof authStateSchema>;