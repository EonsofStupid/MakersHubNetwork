import { Json } from "@/integrations/supabase/types";

export interface WorkflowStep {
  id: string;
  name: string;
  type: string;
  config: Json;
  [key: string]: Json; // Add index signature for Json compatibility
}

export interface WorkflowFormData {
  name: string;
  description: string;
  steps: WorkflowStep[];
}

export interface WorkflowData {
  id: string;
  name: string;
  description: string | null;
  steps: Json;
  triggers?: Json;
  created_by?: string;
  updated_at?: string;
}

export interface ParsedWorkflowData extends Omit<WorkflowData, 'steps'> {
  steps: WorkflowStep[];
}

// Helper function to convert between types
export const parseWorkflowSteps = (steps: Json): WorkflowStep[] => {
  if (!Array.isArray(steps)) return [];
  return steps.map((step: any) => ({
    id: step.id || '',
    name: step.name || '',
    type: step.type || '',
    config: step.config || {},
    ...step
  }));
};

export const serializeWorkflowSteps = (steps: WorkflowStep[]): Json => {
  return steps as Json;
};