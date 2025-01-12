import { z } from "zod";
import { AuthStatusSchema, UserRoleSchema } from "./state.schema";
import { User, Session } from "@supabase/supabase-js";

export const AuthActionsSchema = z.object({
  setUser: z.function()
    .args(z.custom<User>().nullable())
    .returns(z.void()),
  setSession: z.function()
    .args(z.custom<Session>().nullable())
    .returns(z.void()),
  setRoles: z.function()
    .args(z.array(UserRoleSchema))
    .returns(z.void()),
  setError: z.function()
    .args(z.string().nullable())
    .returns(z.void()),
  setStatus: z.function()
    .args(AuthStatusSchema)
    .returns(z.void()),
  setInitialized: z.function()
    .args(z.boolean())
    .returns(z.void()),
  hasRole: z.function()
    .args(UserRoleSchema)
    .returns(z.boolean()),
  isAdmin: z.function()
    .returns(z.boolean()),
  initialize: z.function()
    .returns(z.promise(z.void())),
  login: z.function()
    .args(z.string(), z.string())
    .returns(z.promise(z.void())),
  logout: z.function()
    .returns(z.promise(z.void())),
  clearState: z.function()
    .returns(z.void())
});

export type AuthActionsSchemaType = z.infer<typeof AuthActionsSchema>;