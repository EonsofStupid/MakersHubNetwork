import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import type { WorkflowStageConfig } from '../../../types';

interface TaskConfigProps {
  config: WorkflowStageConfig;
  onChange: (config: WorkflowStageConfig) => void;
}

export const TaskConfig = ({ config, onChange }: TaskConfigProps) => {
  const addCustomField = () => {
    const newField = {
      name: '',
      type: 'text' as const,
      required: false
    };
    onChange({
      ...config,
      customFields: [...(config.customFields || []), newField]
    });
  };

  const removeCustomField = (index: number) => {
    const updatedFields = [...(config.customFields || [])];
    updatedFields.splice(index, 1);
    onChange({ ...config, customFields: updatedFields });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-white/70 mb-2">Time Limit (hours)</label>
        <Input
          type="number"
          min={0}
          value={config.timeLimit || 24}
          onChange={(e) => onChange({ ...config, timeLimit: parseInt(e.target.value) })}
          className="bg-white/5 border-white/10 text-white"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm text-white/70">Custom Fields</label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addCustomField}
            className="text-neon-cyan hover:text-neon-cyan/80"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Field
          </Button>
        </div>
        
        <div className="space-y-3">
          {(config.customFields || []).map((field, index) => (
            <div key={index} className="flex items-start gap-2 bg-white/5 p-3 rounded">
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Field name"
                  value={field.name}
                  onChange={(e) => {
                    const updatedFields = [...(config.customFields || [])];
                    updatedFields[index] = { ...field, name: e.target.value };
                    onChange({ ...config, customFields: updatedFields });
                  }}
                  className="bg-white/5 border-white/10 text-white"
                />
                <select
                  value={field.type}
                  onChange={(e) => {
                    const updatedFields = [...(config.customFields || [])];
                    updatedFields[index] = { 
                      ...field, 
                      type: e.target.value as 'text' | 'number' | 'date' | 'select' 
                    };
                    onChange({ ...config, customFields: updatedFields });
                  }}
                  className="bg-white/5 border-white/10 text-white rounded px-3 py-2 w-full"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="select">Select</option>
                </select>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCustomField(index)}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};