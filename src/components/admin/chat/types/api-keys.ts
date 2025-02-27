
import { Database } from "@/integrations/supabase/types";

export type ApiKey = Database["public"]["Tables"]["api_keys"]["Row"];
export type ApiKeyProvider = "openai" | "stability" | "replicate" | "custom";

export interface ApiKeyFilter {
  provider?: ApiKeyProvider;
  isActive?: boolean;
  search?: string;
}

export interface CreateApiKeyData {
  name: string;
  provider: ApiKeyProvider;
  key: string;
  description?: string;
  expiresAt?: Date;
}
