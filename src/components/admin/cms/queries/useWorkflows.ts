import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Workflow, DatabaseWorkflow, convertDatabaseWorkflow } from '../types/workflow';
import { cmsKeys } from './keys';
import { toast } from '@/hooks/use-toast';

export const useWorkflows = () => {
  return useQuery({
    queryKey: cmsKeys.workflows.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('metadata_workflows')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Ensure we're working with DatabaseWorkflow type
      const dbWorkflows = data as DatabaseWorkflow[];
      return dbWorkflows.map(convertDatabaseWorkflow);
    },
  });
};

export const useWorkflow = (id?: string) => {
  const queryKey = id ? cmsKeys.workflows.detail(id) : ['workflow', 'new'];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('metadata_workflows')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Ensure we're working with DatabaseWorkflow type
      const dbWorkflow = data as DatabaseWorkflow;
      return dbWorkflow ? convertDatabaseWorkflow(dbWorkflow) : null;
    },
    enabled: !!id,
  });
};

export const useSaveWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workflow: Workflow) => {
      // Prepare database workflow with required fields
      const dbWorkflow = {
        name: workflow.name,
        description: workflow.description || '',
        is_active: workflow.status === 'active',
        fields: JSON.stringify({ steps: workflow.steps || [] }),
        slug: workflow.name.toLowerCase().replace(/\s+/g, '-'),
        default_values: JSON.stringify({}),
        linked_parts: JSON.stringify({}),
        validation_rules: JSON.stringify({}),
        version: 1,
        ...(workflow.id ? { id: workflow.id } : {})
      };

      if (workflow.id) {
        // Update existing workflow
        const { data, error } = await supabase
          .from('metadata_workflows')
          .update(dbWorkflow)
          .eq('id', workflow.id)
          .select()
          .single();
        
        if (error) throw error;
        return convertDatabaseWorkflow(data as DatabaseWorkflow);
      } else {
        // Create new workflow
        const { data, error } = await supabase
          .from('metadata_workflows')
          .insert(dbWorkflow)
          .select()
          .single();
        
        if (error) throw error;
        return convertDatabaseWorkflow(data as DatabaseWorkflow);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.workflows.all });
      
      toast({
        title: "Workflow Saved",
        description: "The workflow has been successfully saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to save workflow: " + error.message,
        variant: "destructive",
      });
    },
  });
};
