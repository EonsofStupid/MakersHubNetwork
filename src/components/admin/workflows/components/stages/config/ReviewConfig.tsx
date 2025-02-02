import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { WorkflowStageConfig } from '../../../types';

interface ReviewConfigProps {
  config: WorkflowStageConfig;
  onChange: (config: WorkflowStageConfig) => void;
}

export const ReviewConfig = ({ config, onChange }: ReviewConfigProps) => {
  const handleAutoAssignmentChange = (type: 'user' | 'role' | 'group') => {
    onChange({
      ...config,
      autoAssignment: {
        ...config.autoAssignment,
        type
      }
    });
  };

  const handleAutoAssignmentValueChange = (value: string) => {
    onChange({
      ...config,
      autoAssignment: {
        ...config.autoAssignment,
        value
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm text-white/70">Time Limit (hours)</Label>
        <Input
          type="number"
          min={0}
          value={config.timeLimit || 48}
          onChange={(e) => onChange({ ...config, timeLimit: parseInt(e.target.value) })}
          className="bg-white/5 border-white/10 text-white mt-2"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm text-white/70">Auto Assignment</Label>
        <Select
          value={config.autoAssignment?.type || 'user'}
          onValueChange={(value: 'user' | 'role' | 'group') => handleAutoAssignmentChange(value)}
        >
          <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="Select assignment type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Specific User</SelectItem>
            <SelectItem value="role">Role-based</SelectItem>
            <SelectItem value="group">Group</SelectItem>
          </SelectContent>
        </Select>

        {config.autoAssignment?.type === 'user' && (
          <Input
            placeholder="Enter user ID or email"
            value={config.autoAssignment?.value || ''}
            onChange={(e) => handleAutoAssignmentValueChange(e.target.value)}
            className="bg-white/5 border-white/10 text-white mt-2"
          />
        )}

        {config.autoAssignment?.type === 'role' && (
          <Select
            value={config.autoAssignment?.value || 'subscriber'}
            onValueChange={handleAutoAssignmentValueChange}
          >
            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="subscriber">Subscriber</SelectItem>
              <SelectItem value="maker">Maker</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
            </SelectContent>
          </Select>
        )}

        {config.autoAssignment?.type === 'group' && (
          <Input
            placeholder="Enter group name"
            value={config.autoAssignment?.value || ''}
            onChange={(e) => handleAutoAssignmentValueChange(e.target.value)}
            className="bg-white/5 border-white/10 text-white mt-2"
          />
        )}
      </div>

      <div className="space-y-2 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-white/70">Enable Notifications</Label>
          <Switch
            checked={config.notifications?.onStart || false}
            onCheckedChange={(checked) => 
              onChange({ 
                ...config, 
                notifications: { 
                  ...config.notifications, 
                  onStart: checked 
                } 
              })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-sm text-white/70">Notify on Complete</Label>
          <Switch
            checked={config.notifications?.onComplete || false}
            onCheckedChange={(checked) => 
              onChange({ 
                ...config, 
                notifications: { 
                  ...config.notifications, 
                  onComplete: checked 
                } 
              })
            }
          />
        </div>
      </div>
    </div>
  );
};