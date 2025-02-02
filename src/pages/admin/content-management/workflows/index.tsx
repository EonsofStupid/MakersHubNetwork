import React from "react";
import { AdminNav } from "@/components/admin/dashboard/AdminNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const WorkflowsManagement = () => {
  const navigate = useNavigate();
  
  const { data: workflows, isLoading, error } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      console.log('Fetching workflows...');
      const { data, error } = await supabase
        .from('cms_workflows')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching workflows:', error);
        throw error;
      }

      console.log('Fetched workflows:', data);
      return data;
    }
  });

  if (error) {
    console.error('Error in workflow query:', error);
    toast.error('Failed to load workflows');
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-20 p-8">
      <AdminNav />
      <div className="container mx-auto">
        <Card className="glass border-white/10 p-6 bg-black/40 backdrop-blur-xl shadow-[0_0_15px_rgba(65,240,219,0.2)] animate-fade-in">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Approval Workflows</h1>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="border-white/10 text-white hover:bg-white/5"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button 
                className="bg-neon-cyan/20 text-white border border-neon-cyan/50 hover:bg-neon-cyan/30"
                onClick={() => navigate('new')}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Workflow
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div>
            </div>
          ) : workflows?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60">No workflows created yet.</p>
              <p className="text-white/40 text-sm mt-2">Create a workflow to manage your content approval process.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {workflows?.map((workflow) => (
                <Card 
                  key={workflow.id}
                  className="p-6 bg-white/5 border-white/10 hover:border-neon-cyan/50 transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{workflow.name}</h3>
                      <p className="text-white/60 mt-1">{workflow.description}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="text-white/60 hover:text-white hover:bg-white/5"
                      onClick={() => navigate(workflow.id)}
                    >
                      Manage
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default WorkflowsManagement;