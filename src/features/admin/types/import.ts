
export type ColumnMapping = {
  csvColumn: string;
  targetField: string;
  type: 'basic' | 'specification' | 'compatibility' | 'dimension' | 'price';
  transformation?: (value: string) => any;
};

export type ImportStep = 'upload' | 'mapping' | 'preview' | 'import';

export type ValidationError = {
  row: number;
  column: string;
  message: string;
};

export type ImportPreviewData = {
  original: Record<string, string>;
  mapped: Record<string, any>;
  errors?: ValidationError[];
};

export type ImportSession = {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalRows: number;
  processedRows: number;
  successCount: number;
  errorCount: number;
  mappingConfig: Record<string, string>;
  originalFilename?: string;
};
