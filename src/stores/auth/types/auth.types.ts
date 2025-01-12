import { User, Session } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";
import { AuthStateSchemaType, AuthActionsSchemaType } from "../schemas/actions.schema";

export type UserRole = Database["public"]["Enums"]["user_role"];
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export type AuthState = AuthStateSchemaType;
export type AuthActions = AuthActionsSchemaType;
export type AuthStore = AuthState & AuthActions;