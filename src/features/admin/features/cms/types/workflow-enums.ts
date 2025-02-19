
export type WorkflowFieldType = 
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'select'
  | 'multiselect'
  | 'rich-text'
  | 'file'
  | 'image'
  | 'reference'
  | 'array';

export type WorkflowStatus = 'draft' | 'active' | 'archived';
