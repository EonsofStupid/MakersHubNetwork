import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { WorkflowStageType } from '../../types';

interface StageTypeSelectorProps {
  value: WorkflowStageType;
  onChange: (value: WorkflowStageType) => void;
}

export const StageTypeSelector = ({ value, onChange }: StageTypeSelectorProps) => {
  const stageTypes: { value: WorkflowStageType; label: string }[] = [
    { value: 'approval', label: 'Approval' },
    { value: 'review', label: 'Review' },
    { value: 'task', label: 'Task' },
    { value: 'notification', label: 'Notification' },
    { value: 'conditional', label: 'Conditional' },
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
        <SelectValue placeholder="Select stage type" />
      </SelectTrigger>
      <SelectContent>
        {stageTypes.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};