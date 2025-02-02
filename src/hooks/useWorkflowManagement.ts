import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useWorkflowStore } from '@/lib/store/workflow-store';
import { toast } from 'sonner';

export const useWorkflowManagement = () => {
  const queryClient = useQueryClient();
  const { setActiveWorkflow, addToHistory } = useWorkflowStore();

  const { data: workflows, isLoading, error } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      console.log('Fetching workflows...');
      const { data, error } = await supabase
        .from('cms_workflows')
        .select(`
          *,
          created_by (
            username,
            display_name
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching workflows:', error);
        throw error;
      }

      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const createWorkflow = useMutation({
    mutationFn: async ({ name, description, steps, triggers }: {
      name: string;
      description?: string;
      steps: any[];
      triggers?: any[];
    }) => {
      console.log('Creating workflow:', { name, description, steps, triggers });
      const { data, error } = await supabase
        .from('cms_workflows')
        .insert({
          name,
          description,
          steps,
          triggers: triggers || [],
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      setActiveWorkflow(data.id, data);
      addToHistory(data.id, { 
        type: 'created', 
        timestamp: new Date().toISOString() 
      });
      toast.success('Workflow created successfully');
    },
    onError: (error) => {
      console.error('Error creating workflow:', error);
      toast.error('Failed to create workflow');
    }
  });

  const updateWorkflow = useMutation({
    mutationFn: async ({ id, ...updates }: { 
      id: string; 
      name?: string;
      description?: string;
      steps?: any[];
      triggers?: any[];
    }) => {
      console.log('Updating workflow:', { id, ...updates });
      const { data, error } = await supabase
        .from('cms_workflows')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      setActiveWorkflow(data.id, data);
      addToHistory(data.id, { 
        type: 'updated', 
        timestamp: new Date().toISOString() 
      });
      toast.success('Workflow updated successfully');
    },
    onError: (error) => {
      console.error('Error updating workflow:', error);
      toast.error('Failed to update workflow');
    }
  });

  const deleteWorkflow = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting workflow:', id);
      const { error } = await supabase
        .from('cms_workflows')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      addToHistory(id, { 
        type: 'deleted', 
        timestamp: new Date().toISOString() 
      });
      toast.success('Workflow deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting workflow:', error);
      toast.error('Failed to delete workflow');
    }
  });

  return {
    workflows,
    isLoading,
    error,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow
  };
};