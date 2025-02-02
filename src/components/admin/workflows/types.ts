import { Json } from "@/integrations/supabase/types";

export type WorkflowStageType = 'approval' | 'review' | 'task' | 'notification' | 'conditional';

export interface StageValidationRule {
  field: string;
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message?: string;
}

export interface WorkflowStageConfig {
  timeLimit?: number;
  requiredApprovers?: number;
  customFields?: {
    name: string;
    type: 'text' | 'number' | 'date' | 'select';
    options?: string[];
    required?: boolean;
  }[];
  autoAssignment?: {
    type: 'user' | 'role' | 'group';
    value: string;
  };
  notifications?: {
    onStart?: boolean;
    onComplete?: boolean;
    reminderInterval?: number;
  };
}

export interface WorkflowStage {
  id: string;
  name: string;
  description?: string;
  type: WorkflowStageType;
  order: number;
  config: WorkflowStageConfig;
  validationRules?: StageValidationRule[];
}

export interface WorkflowTemplate {
  id?: string;
  name: string;
  description: string | null;
  stages: WorkflowStage[];
  is_active: boolean;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
}

export interface WorkflowFormData {
  name: string;
  description: string;
  stages: WorkflowStage[];
  is_active: boolean;
}

export const serializeStages = (stages: WorkflowStage[]): Json => {
  return JSON.parse(JSON.stringify(stages)) as Json;
};

export const parseStages = (stages: Json): WorkflowStage[] => {
  if (!Array.isArray(stages)) return [];
  return stages.map((stage: any) => ({
    id: stage.id || crypto.randomUUID(),
    name: stage.name || '',
    description: stage.description || '',
    type: stage.type || 'task',
    order: stage.order || 0,
    config: stage.config || {},
    validationRules: stage.validationRules || []
  }));
};

export const validateStage = (stage: WorkflowStage): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!stage.name.trim()) {
    errors.push('Stage name is required');
  }

  switch (stage.type) {
    case 'approval':
      if (!stage.config.requiredApprovers || stage.config.requiredApprovers < 1) {
        errors.push('At least one approver is required');
      }
      break;
    case 'review':
      if (!stage.config.autoAssignment?.value) {
        errors.push('Reviewer assignment is required');
      }
      break;
    case 'task':
      if (stage.config.customFields?.some(field => field.required && !field.name)) {
        errors.push('Required custom fields must have a name');
      }
      break;
  }

  stage.validationRules?.forEach(rule => {
    if (rule.type === 'required' && !stage.config[rule.field]) {
      errors.push(rule.message || `${rule.field} is required`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Enterprise-level type definitions for stage updates
export type StageUpdateFunction = (stageId: string, updates: Partial<WorkflowStage>) => void;

export interface StageConfigUpdateProps {
  stage: WorkflowStage;
  onUpdate: (updates: Partial<WorkflowStage>) => void;
}

// Type guard to ensure stage updates are valid
export const isValidStageUpdate = (update: Partial<WorkflowStage>): boolean => {
  const requiredKeys: (keyof WorkflowStage)[] = ['id', 'type'];
  return !requiredKeys.some(key => key in update && !update[key]);
};

// Utility function to safely update stage configuration
export const createStageUpdate = (stageId: string, updates: Partial<WorkflowStage>): { id: string } & Partial<WorkflowStage> => {
  return {
    id: stageId,
    ...updates
  };
};