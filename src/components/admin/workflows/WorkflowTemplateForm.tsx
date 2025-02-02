import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { WorkflowFormHeader } from './components/WorkflowFormHeader';
import { WorkflowBasicFields } from './components/WorkflowBasicFields';
import { VisualWorkflowBuilder } from './components/VisualWorkflowBuilder';
import { WorkflowTemplate, WorkflowFormData, serializeStages, parseStages, validateStage } from './types';

export const WorkflowTemplateForm = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isNewTemplate = !id;

  const [formData, setFormData] = useState<WorkflowFormData>({
    name: '',
    description: '',
    stages: [],
    is_active: true
  });

  const { data: template, isLoading } = useQuery({
    queryKey: ['workflow-template', id],
    queryFn: async () => {
      if (isNewTemplate) return null;
      
      const { data, error } = await supabase
        .from('workflow_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching template:', error);
        toast.error('Failed to fetch template');
        throw error;
      }
      
      return {
        ...data,
        stages: parseStages(data.stages)
      } as WorkflowTemplate;
    },
    enabled: !isNewTemplate
  });

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        description: template.description || '',
        stages: template.stages,
        is_active: template.is_active
      });
    }
  }, [template]);

  const mutation = useMutation({
    mutationFn: async (data: WorkflowFormData) => {
      const templateData = {
        name: data.name,
        description: data.description,
        stages: serializeStages(data.stages),
        is_active: data.is_active
      };

      if (isNewTemplate) {
        const { data: newTemplate, error } = await supabase
          .from('workflow_templates')
          .insert([templateData])
          .select()
          .single();

        if (error) throw error;
        return newTemplate;
      } else {
        const { data: updatedTemplate, error } = await supabase
          .from('workflow_templates')
          .update(templateData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return updatedTemplate;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-templates'] });
      toast.success(`Template ${isNewTemplate ? 'created' : 'updated'} successfully`);
    },
    onError: (error) => {
      console.error('Error saving template:', error);
      toast.error(`Failed to ${isNewTemplate ? 'create' : 'update'} template`);
    }
  });

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    // Validate template name
    if (!formData.name.trim()) {
      toast.error('Template name is required');
      return;
    }

    // Validate all stages
    const stageValidations = formData.stages.map(validateStage);
    const invalidStages = stageValidations.filter(v => !v.isValid);

    if (invalidStages.length > 0) {
      toast.error(`Please fix validation errors in ${invalidStages.length} stage(s)`);
      return;
    }

    mutation.mutate(formData);
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isNewTemplate && isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <WorkflowFormHeader 
        isNewTemplate={isNewTemplate}
        isPending={mutation.isPending}
        onSubmit={handleSubmit}
      />

      <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <WorkflowBasicFields
            name={formData.name}
            description={formData.description}
            isActive={formData.is_active}
            onChange={handleFieldChange}
          />

          <div className="border-t border-white/10 pt-6">
            <VisualWorkflowBuilder
              stages={formData.stages}
              onChange={(stages) => handleFieldChange('stages', stages)}
            />
          </div>
        </form>
      </Card>
    </div>
  );
};