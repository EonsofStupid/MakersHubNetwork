
export interface ImportFormat {
  id: string;
  name: string;
  extension: string;
  description: string;
  maxSize: number;
  isEnabled: boolean;
}

export interface ImportTemplate {
  id: string;
  name: string;
  description?: string;
  format: string;
  fields: ImportField[];
  createdAt: string;
  updatedAt: string;
}

export interface ImportField {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum';
  required: boolean;
  defaultValue?: string;
  options?: string[];
  description?: string;
  validation?: string;
}

export interface ImportConfig {
  templateId: string;
  options: {
    skipFirstRow: boolean;
    updateExisting: boolean;
    identifierField?: string;
    dryRun: boolean;
    notifyOnCompletion: boolean;
  };
}

export interface ImportResult {
  id: string;
  status: 'processing' | 'completed' | 'failed' | 'cancelled';
  totalRecords: number;
  processedRecords: number;
  successRecords: number;
  failedRecords: number;
  warnings: ImportWarning[];
  errors: ImportError[];
  startTime: string;
  endTime?: string;
  filename: string;
  userId: string;
}

export interface ImportWarning {
  row: number;
  field: string;
  message: string;
}

export interface ImportError {
  row: number;
  field?: string;
  message: string;
  code?: string;
}
