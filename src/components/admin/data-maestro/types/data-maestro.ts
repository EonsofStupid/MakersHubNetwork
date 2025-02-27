
// Data structure types
export type TableConstraintType = 'primary' | 'unique' | 'foreign' | 'check';

export interface TableConstraint {
  name: string;
  type: TableConstraintType;
  columns: string[];
  referenced_table?: string;
  referenced_columns?: string[];
  condition?: string;
}

export interface TableColumn {
  name: string;
  data_type: string;
  is_nullable: boolean;
  default_value?: string;
  description?: string;
  constraints?: TableConstraint[];
}

export interface DatabaseTable {
  schema: string;
  name: string;
  description?: string;
  columns: TableColumn[];
  constraints: TableConstraint[];
  row_count?: number;
  size_bytes?: number;
  created_at?: string;
  last_modified?: string;
}

export interface SchemaRelationship {
  source_table: string;
  source_column: string;
  target_table: string;
  target_column: string;
  name: string;
}

export interface DatabaseSchema {
  name: string;
  tables: DatabaseTable[];
  relationships: SchemaRelationship[];
}

// Baseline and validation types
export interface ValidationRule {
  id: string;
  name: string;
  description?: string;
  table: string;
  column?: string;
  condition: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  is_active: boolean;
}

export interface BaselineConfig {
  id: string;
  table_name: string;
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface ValidationResult {
  rule_id: string;
  rule_name: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  affected_rows: number;
  details?: string;
}
