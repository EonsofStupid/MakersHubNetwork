import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkflowStore } from '@/lib/store/workflow-store';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: any[];
  triggers: any[];
  created_by: string;
  updated_at: string;
}

export const WorkflowManagement = () => {
  const { activeWorkflows, setActiveWorkflow, addToHistory } = useWorkflowStore();

  const { data: workflows, isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      console.log('Fetching workflows...');
      const { data, error } = await supabase
        .from('cms_workflows')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching workflows:', error);
        toast.error('Failed to load workflows');
        throw error;
      }

      return data as Workflow[];
    }
  });

  const handleActivateWorkflow = async (workflow: Workflow) => {
    try {
      console.log('Activating workflow:', workflow.id);
      setActiveWorkflow(workflow.id, workflow);
      addToHistory(workflow.id, {
        action: 'activated',
        timestamp: new Date().toISOString(),
      });
      toast.success(`Workflow ${workflow.name} activated`);
    } catch (error) {
      console.error('Error activating workflow:', error);
      toast.error('Failed to activate workflow');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-neon-cyan" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <Tabs defaultValue="active" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-gray-800/50 border-white/10">
            <TabsTrigger value="active" className="data-[state=active]:bg-white/10">
              Active Workflows
            </TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-white/10">
              All Workflows
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-white/10">
              History
            </TabsTrigger>
          </TabsList>
          
          <Button className="bg-neon-cyan/20 hover:bg-neon-cyan/30">
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>

        <TabsContent value="active" className="space-y-4">
          {Object.entries(activeWorkflows).map(([id, workflow]) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 border border-white/10 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{workflow.name}</h3>
                  <p className="text-sm text-gray-400">{workflow.description}</p>
                </div>
                <Button
                  variant="ghost"
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  onClick={() => {
                    // Deactivate workflow logic
                    toast.success(`Workflow ${workflow.name} deactivated`);
                  }}
                >
                  Deactivate
                </Button>
              </div>
            </motion.div>
          ))}
          {Object.keys(activeWorkflows).length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No active workflows
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {workflows?.map((workflow) => (
            <motion.div
              key={workflow.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 border border-white/10 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{workflow.name}</h3>
                  <p className="text-sm text-gray-400">{workflow.description}</p>
                </div>
                <Button
                  variant="ghost"
                  className="text-neon-cyan hover:text-neon-cyan/80 hover:bg-neon-cyan/10"
                  onClick={() => handleActivateWorkflow(workflow)}
                >
                  Activate
                </Button>
              </div>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {Object.entries(useWorkflowStore.getState().workflowHistory).map(([id, history]) => (
            <div key={id} className="bg-gray-800/50 border border-white/10 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                Workflow {workflows?.find(w => w.id === id)?.name || id}
              </h3>
              <div className="space-y-2">
                {history.map((entry, index) => (
                  <div key={index} className="text-sm text-gray-400">
                    {entry.action} at {new Date(entry.timestamp).toLocaleString()}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </Card>
  );
};