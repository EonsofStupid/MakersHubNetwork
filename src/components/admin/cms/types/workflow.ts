
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

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  steps?: WorkflowStep[];
  created_at?: string;
  updated_at?: string;
}
