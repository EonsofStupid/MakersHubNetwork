
export type ColumnMapping = {
  csvColumn: string;
  targetField: string;
  type: 'basic' | 'specification' | 'compatibility' | 'dimension' | 'price';
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

