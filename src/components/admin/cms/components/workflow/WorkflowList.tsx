
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GitBranch, Check, Clock, AlertCircle } from 'lucide-react';
import { Workflow } from '../../types/workflow';
import { cmsKeys } from '../../queries/keys';

export const useWorkflows = () => {
  return useQuery({
    queryKey: cmsKeys.workflows.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('metadata_workflows')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Workflow[];
    },
  });
};

export const WorkflowList = () => {
  const { data: workflows = [], isLoading } = useWorkflows();
  
  if (isLoading) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Loading workflows...
      </div>
    );
  }
  
  if (workflows.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p>No workflows found</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {workflows.map(workflow => (
        <div 
          key={workflow.id}
          className="flex items-center justify-between p-3 rounded-md hover:bg-primary/10 cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-3">
            <GitBranch className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">{workflow.name}</p>
              <p className="text-xs text-muted-foreground">{workflow.steps?.length || 0} steps</p>
            </div>
          </div>
          
          <div className="flex items-center">
            {workflow.status === 'active' && (
              <Check className="w-4 h-4 text-green-500" />
            )}
            {workflow.status === 'draft' && (
              <Clock className="w-4 h-4 text-amber-500" />
            )}
            {workflow.status === 'disabled' && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
