import { StateCreator } from "zustand";
import { AuthState, AuthActions, AuthStore, AuthStatus } from "../types/auth.types";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { AuthStateSchema } from "../schemas/state.schema";

export type UserRole = Database["public"]["Enums"]["user_role"];
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export type AuthState = AuthStateSchemaType;
export type AuthActions = AuthActionsSchemaType;
export type AuthStore = AuthState & AuthActions;