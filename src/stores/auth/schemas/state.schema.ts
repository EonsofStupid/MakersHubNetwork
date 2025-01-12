// src/stores/auth/schemas/state.schema.ts

import { z } from "zod";
import { User, Session } from "@supabase/supabase-js";

// Some existing code omitted for brevity
// ...
// The base state schema should include `isLoading`.
export const AuthStateSchema = z.object({
  user: z.custom<User>().nullable(),
  session: z.custom<Session>().nullable(),
  roles: z.array(z.enum(["admin", "editor", "viewer"])),
  status: z.enum(["idle", "loading", "authenticated", "unauthenticated"]),
  error: z.string().nullable(),
  initialized: z.boolean(),

  // Add `isLoading` here
  isLoading: z.boolean(),
});

// ...
