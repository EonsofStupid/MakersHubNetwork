
import { WorkflowFieldType } from './workflow-enums';

export interface WorkflowField {
  id: string;
  name: string;
  type: WorkflowFieldType;
  required: boolean;
  description?: string;
  defaultValue?: any;
  validationRules?: Record<string, any>;
  config?: {
    min?: number;
    max?: number;
    options?: string[];
    relationTable?: string;
    relationDisplayField?: string;
    multiple?: boolean;
    allowedTypes?: string[];
  };
}

export interface Workflow {
  id: string;
  name: string;
  slug: string;
  description?: string;
  fields: WorkflowField[];
  validationRules: Record<string, any>;
  defaultValues: Record<string, any>;
  linkedParts: string[];
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowVersion {
  id: string;
  workflowId: string;
  version: number;
  fields: WorkflowField[];
  validationRules: Record<string, any>;
  defaultValues: Record<string, any>;
  createdAt: string;
  createdBy: string;
}

export interface WorkflowInstance {
  id: string;
  workflowId: string;
  contentId: string;
  data: Record<string, any>;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
