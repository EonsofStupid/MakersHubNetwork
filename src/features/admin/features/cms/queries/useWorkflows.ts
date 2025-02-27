
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Workflow, WorkflowField } from '../types/workflow';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

// Type for the database workflow
type DbWorkflow = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  fields: Json;
  validation_rules: Json;
  default_values: Json;
  linked_parts: Json;
  is_active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
};

// Conversion functions
const convertDbToWorkflow = (dbWorkflow: DbWorkflow): Workflow => ({
  id: dbWorkflow.id,
  name: dbWorkflow.name,
  slug: dbWorkflow.slug,
  description: dbWorkflow.description,
  fields: (dbWorkflow.fields as any[]).map(f => ({
    id: f.id,
    name: f.name,
    type: f.type,
    required: f.required,
    description: f.description,
    defaultValue: f.defaultValue,
    validationRules: f.validationRules,
    config: f.config
  })),
  validationRules: dbWorkflow.validation_rules as Record<string, any>,
  defaultValues: dbWorkflow.default_values as Record<string, any>,
  linkedParts: dbWorkflow.linked_parts as string[],
  isActive: dbWorkflow.is_active,
  version: dbWorkflow.version,
  createdAt: dbWorkflow.created_at,
  updatedAt: dbWorkflow.updated_at
});

// Helper function to convert WorkflowField to a plain object
const fieldToJson = (field: WorkflowField): Record<string, Json> => ({
  id: field.id,
  name: field.name,
  type: field.type,
  required: field.required,
  description: field.description || null,
  defaultValue: field.defaultValue || null,
  validationRules: field.validationRules as Json || null,
  config: field.config as Json || null
});

const convertWorkflowToDb = (workflow: Partial<Workflow>) => ({
  name: workflow.name,
  slug: workflow.slug || workflow.name?.toLowerCase().replace(/\s+/g, '-'),
  description: workflow.description,
  fields: workflow.fields?.map(fieldToJson) as Json || [],
  validation_rules: workflow.validationRules as Json || {},
  default_values: workflow.defaultValues as Json || {},
  linked_parts: workflow.linkedParts as Json || [],
  is_active: workflow.isActive,
  version: workflow.version
});

export function useWorkflows() {
  const queryClient = useQueryClient();

  const workflowsQuery = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('metadata_workflows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data?.map(convertDbToWorkflow) ?? [];
    }
  });

  const createWorkflow = useMutation({
    mutationFn: async (workflow: Partial<Workflow>) => {
      const dbWorkflow = convertWorkflowToDb(workflow);
      const { data, error } = await supabase
        .from('metadata_workflows')
        .insert(dbWorkflow)
        .select()
        .single();

      if (error) throw error;
      return convertDbToWorkflow(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast.success('Workflow created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create workflow');
      console.error('Error creating workflow:', error);
    }
  });

  const updateWorkflow = useMutation({
    mutationFn: async (workflow: Partial<Workflow>) => {
      const dbWorkflow = convertWorkflowToDb(workflow);
      const { data, error } = await supabase
        .from('metadata_workflows')
        .update(dbWorkflow)
        .eq('id', workflow.id)
        .select()
        .single();

      if (error) throw error;
      return convertDbToWorkflow(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast.success('Workflow updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update workflow');
      console.error('Error updating workflow:', error);
    }
  });

  return {
    workflows: workflowsQuery.data,
    isLoading: workflowsQuery.isLoading,
    error: workflowsQuery.error,
    createWorkflow,
    updateWorkflow
  };
}
