export interface ImportSession {
  id: string;
  user_id: string;
  status: string;
  file_name: string;
  file_size: number;
  row_count: number;
  created_at: string;
  completed_at: string;
  error_message: string;
  type: string;
  metadata: Record<string, any>;
}

export interface ImportWizardProps {
  type: 'page' | 'theme' | 'template' | 'csv';
  acceptedTypes?: string[];
  onImport: (files: File[]) => void;
}

export interface ImportConfig {
  type: string;
  schema: {
    type: string;
    required: string[];
    properties: Record<string, any>;
  };
  validator: (data: any) => boolean;
}

export interface ImportValidationResult {
  isValid: boolean;
  errors?: string[];
}