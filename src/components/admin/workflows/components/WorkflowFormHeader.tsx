import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

interface WorkflowFormHeaderProps {
  isNewTemplate: boolean;
  isPending: boolean;
  onSubmit: () => void;
}

export const WorkflowFormHeader = ({ isNewTemplate, isPending, onSubmit }: WorkflowFormHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          className="text-white/60 hover:text-white"
          onClick={() => navigate('/admin/workflows/templates')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold text-white">
          {isNewTemplate ? 'Create New Template' : 'Edit Template'}
        </h2>
      </div>
      <Button
        onClick={onSubmit}
        className="bg-neon-cyan/20 text-white border border-neon-cyan/50 hover:bg-neon-cyan/30"
        disabled={isPending}
      >
        {isPending ? (
          <LoadingSpinner />
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </>
        )}
      </Button>
    </div>
  );
};