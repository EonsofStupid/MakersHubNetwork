import { User, Session } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";
import { AuthStateSchema } from "../schemas/state.schema";
import { AuthActionsSchema } from "../schemas/actions.schema";
import { z } from "zod";

export type UserRole = Database["public"]["Enums"]["user_role"];
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export type AuthState = z.infer<typeof AuthStateSchema>;
export type AuthActions = z.infer<typeof AuthActionsSchema>;
export type AuthStore = AuthState & AuthActions;