
import { WorkflowFieldType } from './workflow-enums';

export interface WorkflowField {
  id: string;
  name: string;
  type: WorkflowFieldType;
  required: boolean;
  description?: string;
  defaultValue?: any;
  validationRules?: Record<string, any>;
  config?: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  slug: string;
  description?: string;
  fields: WorkflowField[];
  validationRules?: Record<string, any>;
  defaultValues?: Record<string, any>;
  linkedParts?: string[];
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}
