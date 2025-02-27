
import { Database } from "@/integrations/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type UserRole = Database["public"]["Enums"]["user_role"];

export interface UserWithRoles extends Profile {
  roles: UserRole[];
}

export interface UserFilter {
  role?: UserRole;
  search?: string;
  isActive?: boolean;
}
