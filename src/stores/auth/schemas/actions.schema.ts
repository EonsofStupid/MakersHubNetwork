import { z } from "zod";
import { AuthStateSchema, UserRoleSchema } from "./state.schema";
import { User, Session } from "@supabase/supabase-js";

// Define action input schemas
export const SetUserSchema = z.custom<User>().nullable();
export const SetSessionSchema = z.custom<Session>().nullable();
export const SetRolesSchema = z.array(UserRoleSchema);
export const SetErrorSchema = z.string().nullable();
export const SetStatusSchema = AuthStateSchema.shape.status;
export const SetInitializedSchema = z.boolean();

// Define the actions schema
export const AuthActionsSchema = z.object({
  setUser: z.function()
    .args(SetUserSchema)
    .returns(z.void()),
  setSession: z.function()
    .args(SetSessionSchema)
    .returns(z.void()),
  setRoles: z.function()
    .args(SetRolesSchema)
    .returns(z.void()),
  setError: z.function()
    .args(SetErrorSchema)
    .returns(z.void()),
  setStatus: z.function()
    .args(SetStatusSchema)
    .returns(z.void()),
  setInitialized: z.function()
    .args(SetInitializedSchema)
    .returns(z.void()),
  hasRole: z.function()
    .args(UserRoleSchema)
    .returns(z.boolean()),
  isAdmin: z.function()
    .args()
    .returns(z.boolean()),
  initialize: z.function()
    .args()
    .returns(z.promise(z.void())),
  login: z.function()
    .args(z.string(), z.string())
    .returns(z.promise(z.void())),
  logout: z.function()
    .args()
    .returns(z.promise(z.void())),
  clearState: z.function()
    .args()
    .returns(z.void()),
});

export type AuthActionsSchemaType = z.infer<typeof AuthActionsSchema>;