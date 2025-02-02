import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string | null;
  stages: any[];
  is_active: boolean;
  created_at: string;
}

export const WorkflowTemplateList = () => {
  const { data: templates, isLoading, error } = useQuery({
    queryKey: ['workflow-templates'],
    queryFn: async () => {
      console.log('Fetching workflow templates...');
      const { data, error } = await supabase
        .from('workflow_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching templates:', error);
        throw error;
      }

      return data as WorkflowTemplate[];
    }
  });

  const handleCreateTemplate = () => {
    // Navigate to template creation page
    window.location.href = '/admin/workflows/templates/new';
  };

  const handleEditTemplate = (id: string) => {
    window.location.href = `/admin/workflows/templates/${id}`;
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('workflow_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Template deleted successfully');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  if (error) {
    toast.error('Failed to load workflow templates');
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Workflow Templates</h2>
        <Button 
          onClick={handleCreateTemplate}
          className="bg-neon-cyan/20 text-white border border-neon-cyan/50 hover:bg-neon-cyan/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : templates?.length === 0 ? (
        <Card className="p-8 text-center bg-black/40 border-white/10">
          <p className="text-white/60">No workflow templates found</p>
          <p className="text-sm text-white/40 mt-2">Create a template to get started</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {templates?.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/10 hover:border-neon-cyan/50 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-white">{template.name}</h3>
                      {template.is_active ? (
                        <span className="flex items-center text-xs text-green-400">
                          <Check className="w-3 h-3 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center text-xs text-red-400">
                          <X className="w-3 h-3 mr-1" />
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-white/60 mt-1">{template.description}</p>
                    <div className="flex items-center gap-2 mt-4">
                      <span className="text-sm text-white/40">
                        {template.stages?.length || 0} stages
                      </span>
                      <span className="text-white/20">•</span>
                      <span className="text-sm text-white/40">
                        Created {new Date(template.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTemplate(template.id)}
                      className="text-white/60 hover:text-white hover:bg-white/5"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};