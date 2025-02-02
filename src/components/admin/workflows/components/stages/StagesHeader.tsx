import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { WorkflowStage } from '../../types';

interface StagesHeaderProps {
  onAddStage: () => void;
}

export const StagesHeader = ({ onAddStage }: StagesHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-white">Workflow Stages</h3>
      <Button
        onClick={onAddStage}
        className="bg-neon-cyan/20 text-white border border-neon-cyan/50 hover:bg-neon-cyan/30"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Stage
      </Button>
    </div>
  );
};