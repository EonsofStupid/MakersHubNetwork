import React from 'react';
import { StagesHeader } from './stages/StagesHeader';
import { StagesList } from './stages/StagesList';
import type { WorkflowStage } from '../types';

interface VisualWorkflowBuilderProps {
  stages: WorkflowStage[];
  onChange: (stages: WorkflowStage[]) => void;
}

export const VisualWorkflowBuilder = ({ stages, onChange }: VisualWorkflowBuilderProps) => {
  const addStage = () => {
    const newStage: WorkflowStage = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      type: 'task',
      order: stages.length,
      config: {}
    };
    onChange([...stages, newStage]);
  };

  return (
    <div className="space-y-6">
      <StagesHeader onAddStage={addStage} />

      <StagesList 
        stages={stages} 
        onStagesChange={onChange} 
      />

      {stages.length === 0 && (
        <div className="text-center py-8 text-white/60">
          No stages added yet. Click "Add Stage" to create your first workflow stage.
        </div>
      )}
    </div>
  );
};