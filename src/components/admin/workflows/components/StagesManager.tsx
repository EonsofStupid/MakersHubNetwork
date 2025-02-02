import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { WorkflowStage } from '../types';

interface StagesManagerProps {
  stages: WorkflowStage[];
  onChange: (stages: WorkflowStage[]) => void;
}

export const StagesManager = ({ stages, onChange }: StagesManagerProps) => {
  const addStage = () => {
    const newStage: WorkflowStage = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      type: 'task', // Set a default type
      order: stages.length,
      config: {} // Add empty config object
    };
    onChange([...stages, newStage]);
  };

  const removeStage = (stageId: string) => {
    onChange(stages.filter(stage => stage.id !== stageId));
  };

  const updateStage = (stageId: string, updates: Partial<WorkflowStage>) => {
    onChange(stages.map(stage => 
      stage.id === stageId ? { ...stage, ...updates } : stage
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Workflow Stages</h3>
        <Button
          type="button"
          onClick={addStage}
          className="bg-neon-cyan/20 text-white border border-neon-cyan/50 hover:bg-neon-cyan/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Stage
        </Button>
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/5 border border-white/10 rounded-lg p-4"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-4">
                <div>
                  <Input
                    value={stage.name}
                    onChange={(e) => updateStage(stage.id, { name: e.target.value })}
                    placeholder={`Stage ${index + 1} name`}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Textarea
                    value={stage.description}
                    onChange={(e) => updateStage(stage.id, { description: e.target.value })}
                    placeholder="Stage description (optional)"
                    className="bg-white/5 border-white/10 text-white"
                    rows={2}
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => removeStage(stage.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}

        {stages.length === 0 && (
          <div className="text-center py-8 text-white/60">
            No stages added yet. Click "Add Stage" to create your first workflow stage.
          </div>
        )}
      </div>
    </div>
  );
};