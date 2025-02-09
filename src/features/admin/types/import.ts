
import { Database } from "@/integrations/supabase/types";

export type ColumnMapping = {
  csvColumn: string;
  targetField: string;
  type: 'basic' | 'specification' | 'compatibility' | 'dimension' | 'price';
  transformation?: (value: string) => any;
};

export type ImportStep = 'upload' | 'mapping' | 'preview' | 'import';

// Use database types for validation errors
export type ValidationError = Omit<Database["public"]["Tables"]["import_errors"]["Row"], "id" | "import_session_id" | "created_at">;

export type ImportPreviewData = {
  original: Record<string, string>;
  mapped: Record<string, any>;
  errors?: ValidationError[];
};

// Use database types for import session
export type ImportSession = Database["public"]["Tables"]["import_sessions"]["Row"];
