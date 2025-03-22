
export interface ImportJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  source: string;
  type: string;
  recordsCount: number;
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
  userId: string;
  metadata?: Record<string, any>;
}

export interface ExportJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  format: 'csv' | 'json' | 'xlsx';
  type: string;
  recordsCount: number;
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
  errorMessage?: string;
  userId: string;
  metadata?: Record<string, any>;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'api' | 'database' | 'file' | 'custom';
  connectionDetails: Record<string, any>;
  lastSync?: string;
  status: 'active' | 'inactive' | 'error';
  createdAt: string;
  updatedAt: string;
}

export interface DataMappingConfig {
  sourceField: string;
  targetField: string;
  transformation?: string;
  required: boolean;
  defaultValue?: string;
}

export interface DataMigration {
  id: string;
  name: string;
  description?: string;
  sourceId: string;
  targetType: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  mapping: DataMappingConfig[];
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  userId: string;
}
