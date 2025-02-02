import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface WorkflowBasicFieldsProps {
  name: string;
  description: string;
  isActive: boolean;
  onChange: (field: string, value: string | boolean) => void;
}

export const WorkflowBasicFields = ({ 
  name, 
  description, 
  isActive, 
  onChange 
}: WorkflowBasicFieldsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-white mb-2">Template Name</label>
        <Input
          value={name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Enter template name"
          className="bg-white/5 border-white/10 text-white"
        />
      </div>

      <div>
        <label className="block text-white mb-2">Description</label>
        <Textarea
          value={description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Enter template description"
          className="bg-white/5 border-white/10 text-white"
          rows={4}
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={isActive}
          onCheckedChange={(checked) => onChange('is_active', checked)}
        />
        <label className="text-white">Active Template</label>
      </div>
    </div>
  );
};