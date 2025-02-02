import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { GripVertical, X, AlertCircle } from 'lucide-react';
import { StageTypeSelector } from './StageTypeSelector';
import { StageConfigPanel } from './StageConfigPanel';
import type { WorkflowStage, StageUpdateFunction } from '../../types';
import { validateStage, isValidStageUpdate, createStageUpdate } from '../../types';

interface StageCardProps {
  stage: WorkflowStage;
  index: number;
  onUpdate: StageUpdateFunction;
  onDelete: (stageId: string) => void;
  dragHandleProps?: any;
}

export const StageCard = ({ 
  stage, 
  index, 
  onUpdate, 
  onDelete,
  dragHandleProps 
}: StageCardProps) => {
  const validation = validateStage(stage);

  // Type-safe event handlers with validation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const update = createStageUpdate(stage.id, { name: e.target.value });
    if (isValidStageUpdate(update)) {
      onUpdate(stage.id, update);
    }
  };

  const handleTypeChange = (value: WorkflowStage['type']) => {
    const update = createStageUpdate(stage.id, { type: value });
    if (isValidStageUpdate(update)) {
      onUpdate(stage.id, update);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const update = createStageUpdate(stage.id, { description: e.target.value });
    if (isValidStageUpdate(update)) {
      onUpdate(stage.id, update);
    }
  };

  const handleConfigUpdate = (updates: Partial<WorkflowStage>) => {
    const update = createStageUpdate(stage.id, updates);
    if (isValidStageUpdate(update)) {
      onUpdate(stage.id, update);
    }
  };

  const handleDelete = () => {
    onDelete(stage.id);
  };

  return (
    <Card className="p-4 bg-white/5 border-white/10 hover:border-neon-cyan/50 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div
          {...dragHandleProps}
          className="mt-2 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-6 h-6 text-white/60" />
        </div>
        
        <div className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center border border-neon-cyan/50 shrink-0">
          {index + 1}
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <Input
              value={stage.name}
              onChange={handleNameChange}
              placeholder={`Stage ${index + 1} name`}
              className={`bg-white/5 border-white/10 text-white ${!stage.name.trim() ? 'border-red-500/50' : ''}`}
            />
            {!stage.name.trim() && (
              <div className="flex items-center gap-2 mt-1 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                Stage name is required
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-white/70">Stage Type</label>
            <StageTypeSelector
              value={stage.type}
              onChange={handleTypeChange}
            />
          </div>

          <Textarea
            value={stage.description}
            onChange={handleDescriptionChange}
            placeholder="Stage description (optional)"
            className="bg-white/5 border-white/10 text-white"
            rows={2}
          />

          <StageConfigPanel 
            stage={stage}
            onUpdate={handleConfigUpdate}
          />

          {!validation.isValid && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
              <div className="flex items-start gap-2 text-red-400">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium mb-1">Validation Errors:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {validation.errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={handleDelete}
          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};