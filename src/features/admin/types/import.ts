
import { Database } from "@/integrations/supabase/types";

export type ColumnType = 'basic' | 'specification' | 'compatibility' | 'dimension' | 'price';

export interface ColumnMapping {
  csvColumn: string;
  targetField: string;
  type: ColumnType;
  transformation?: (value: string) => any;
}

export type ImportStep = 'upload' | 'mapping' | 'preview' | 'import';

// Base DB row types using the source of truth
export type ImportSessionRow = Database["public"]["Tables"]["import_sessions"]["Row"];
export type ImportErrorRow = Database["public"]["Tables"]["import_errors"]["Row"];

// ValidationError omits system fields but maintains DB schema alignment
export type ValidationError = Omit<ImportErrorRow, "id" | "import_session_id" | "created_at">;

export interface ImportPreviewData {
  original: Record<string, string>;
  mapped: Record<string, any>;
  errors?: ValidationError[];
}

// Extending the base DB type with strongly-typed discriminated union for status
export interface ImportSession extends Omit<ImportSessionRow, "status"> {
  status: "pending" | "processing" | "completed" | "failed" | "completed_with_errors";
}

