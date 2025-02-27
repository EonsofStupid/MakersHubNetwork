type Json = any;

export type WorkflowStepType = 'review' | 'approval' | 'publish' | 'custom';
export type WorkflowStatus = 'draft' | 'active' | 'disabled';

export interface WorkflowStep {
  id: string;
  name: string;
  type: WorkflowStepType;
  order: number;
  required_roles?: string[];
  config?: Record<string, any>;
}

export interface DatabaseWorkflow {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  default_values: Json;
  fields: Json;
  linked_parts: Json;
  slug: string;
  validation_rules: Json;
  version: number;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  steps?: WorkflowStep[];
  created_at?: string;
  updated_at?: string;
}

export const convertDatabaseWorkflow = (dbWorkflow: DatabaseWorkflow): Workflow => {
  return {
    id: dbWorkflow.id,
    name: dbWorkflow.name,
    description: dbWorkflow.description,
    status: dbWorkflow.is_active ? 'active' : 'disabled',
    steps: (dbWorkflow.fields as any)?.steps || [],
    created_at: dbWorkflow.created_at,
    updated_at: dbWorkflow.updated_at,
  };
};
