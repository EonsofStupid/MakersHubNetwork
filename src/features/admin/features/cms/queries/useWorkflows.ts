
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Workflow } from '../types/workflow';
import { toast } from 'sonner';

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
      return data;
    }
  });

  const createWorkflow = useMutation({
    mutationFn: async (workflow: Partial<Workflow>) => {
      const { data, error } = await supabase
        .from('metadata_workflows')
        .insert([workflow])
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('metadata_workflows')
        .update(workflow)
        .eq('id', workflow.id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
    createWorkflow,
    updateWorkflow
  };
}
