
// Define as both type and enum for runtime usage
export const WorkflowFieldType = {
  TEXT: 'text',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  DATE: 'date',
  SELECT: 'select',
  MULTISELECT: 'multiselect',
  RICH_TEXT: 'rich-text',
  FILE: 'file',
  IMAGE: 'image',
  REFERENCE: 'reference',
  ARRAY: 'array'
} as const;

export type WorkflowFieldType = typeof WorkflowFieldType[keyof typeof WorkflowFieldType];

export type WorkflowStatus = 'draft' | 'active' | 'archived';
