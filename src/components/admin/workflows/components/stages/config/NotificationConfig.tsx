import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { WorkflowStageConfig } from '../../../types';

interface NotificationConfigProps {
  config: WorkflowStageConfig;
  onChange: (config: WorkflowStageConfig) => void;
}

export const NotificationConfig = ({ config, onChange }: NotificationConfigProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-white/70 mb-2">Reminder Interval (hours)</label>
        <Input
          type="number"
          min={0}
          value={config.notifications?.reminderInterval || 24}
          onChange={(e) => 
            onChange({
              ...config,
              notifications: {
                ...config.notifications,
                reminderInterval: parseInt(e.target.value)
              }
            })
          }
          className="bg-white/5 border-white/10 text-white"
        />
      </div>
    </div>
  );
};