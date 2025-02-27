
export type ImportStatus = 'pending' | 'mapping' | 'validating' | 'processing' | 'completed' | 'failed';

export interface ColumnMapping {
  source_column: string;
  target_column: string;
  transformation_rule?: TransformationRule;
}

export interface TransformationRule {
  type: string;
  params?: Record<string, any>;
}

export interface ValidationRule {
  column: string;
  rule: string;
  params?: Record<string, any>;
  message: string;
}

export interface ImportSession {
  id: string;
  status: ImportStatus;
  original_filename?: string;
  column_types: Record<string, string>;
  mapping_config: Record<string, string>;
  validation_rules?: Record<string, ValidationRule[]>;
  total_rows: number;
  processed_rows: number;
  success_count: number;
  error_count: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface ImportError {
  id: string;
  import_session_id: string;
  row_number: number;
  column_name?: string;
  error_type: string;
  error_message: string;
  original_value?: string;
  created_at: string;
}

export interface ImportMapping {
  id: string;
  import_session_id: string;
  source_column: string;
  target_column: string;
  transformation_rule?: TransformationRule;
  created_at: string;
  updated_at: string;
}

export interface PreviewData {
  columns: string[];
  rows: string[][];
}
