import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { WorkflowFormData } from "@/components/content/types/workflow";

interface WorkflowFormProps {
  formData: WorkflowFormData;
  onChange: (data: Partial<WorkflowFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const WorkflowForm = ({ formData, onChange, onSubmit }: WorkflowFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-white mb-2">Workflow Name</label>
        <Input
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Enter workflow name"
          className="bg-white/5 border-white/10 text-white"
        />
      </div>

      <div>
        <label className="block text-white mb-2">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Enter workflow description"
          className="bg-white/5 border-white/10 text-white"
          rows={4}
        />
      </div>

      <div className="border border-white/10 rounded-lg p-6 mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">Workflow Steps</h2>
        <p className="text-white/60">Step configuration will be available in the next update.</p>
      </div>
    </form>
  );
};