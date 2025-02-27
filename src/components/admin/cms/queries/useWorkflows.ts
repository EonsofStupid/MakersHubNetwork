
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Workflow } from '../types/workflow';
import { cmsKeys } from './keys';
import { toast } from '@/hooks/use-toast';

export const useWorkflows = () => {
  return useQuery({
    queryKey: cmsKeys.workflows.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_workflows')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Workflow[];
    },
  });
};

export const useWorkflow = (id?: string) => {
  return useQuery({
    queryKey: cmsKeys.workflows.detail(id || 'new'),
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('content_workflows')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Workflow;
    },
    enabled: !!id,
  });
};

export const useSaveWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workflow: Workflow) => {
      if (workflow.id) {
        // Update existing workflow
        const { data, error } = await supabase
          .from('content_workflows')
          .update(workflow)
          .eq('id', workflow.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Create new workflow
        const { data, error } = await supabase
          .from('content_workflows')
          .insert(workflow)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.workflows.list() });
      queryClient.invalidateQueries({ queryKey: cmsKeys.workflows.detail(data.id) });
      
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
