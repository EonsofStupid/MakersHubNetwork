
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Workflow, WorkflowStep, WorkflowStepType, WorkflowStatus } from '../../types/workflow';
import { PlusCircle, X, ChevronUp, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface WorkflowEditorProps {
  workflow?: Workflow;
  onSave?: (workflow: Workflow) => void;
}

export const WorkflowEditor = ({ workflow, onSave }: WorkflowEditorProps) => {
  const [workflowData, setWorkflowData] = useState<Workflow>(
    workflow || {
      id: '',
      name: '',
      description: '',
      status: 'draft',
      steps: [],
    }
  );

  const handleAddStep = () => {
    setWorkflowData(prev => ({
      ...prev,
      steps: [
        ...prev.steps || [],
        {
          id: `step_${Date.now()}`,
          name: 'New Step',
          type: 'review',
          order: (prev.steps?.length || 0) + 1,
        },
      ],
    }));
  };

  const handleRemoveStep = (stepId: string) => {
    setWorkflowData(prev => ({
      ...prev,
      steps: prev.steps?.filter(step => step.id !== stepId) || [],
    }));
  };

  const handleStepChange = (stepId: string, field: keyof WorkflowStep, value: any) => {
    setWorkflowData(prev => ({
      ...prev,
      steps: prev.steps?.map(step => 
        step.id === stepId ? { ...step, [field]: value } : step
      ) || [],
    }));
  };

  const handleMoveStep = (stepId: string, direction: 'up' | 'down') => {
    const steps = [...(workflowData.steps || [])];
    const index = steps.findIndex(step => step.id === stepId);
    
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === steps.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const step = steps[index];
    steps.splice(index, 1);
    steps.splice(newIndex, 0, step);
    
    // Update order values
    const updatedSteps = steps.map((step, i) => ({
      ...step,
      order: i + 1,
    }));
    
    setWorkflowData(prev => ({
      ...prev,
      steps: updatedSteps,
    }));
  };

  const handleWorkflowUpdate = (field: keyof Workflow, value: any) => {
    setWorkflowData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(workflowData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Workflow Name</Label>
          <Input
            id="name"
            value={workflowData.name}
            onChange={(e) => handleWorkflowUpdate('name', e.target.value)}
            placeholder="Enter workflow name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={workflowData.description || ''}
            onChange={(e) => handleWorkflowUpdate('description', e.target.value)}
            placeholder="Enter workflow description"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={workflowData.status}
            onValueChange={(value: WorkflowStatus) => handleWorkflowUpdate('status', value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Workflow Steps</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddStep}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Step
          </Button>
        </div>
        
        <div className="space-y-4">
          {workflowData.steps?.map(step => (
            <div 
              key={step.id}
              className="flex items-start space-x-2 p-4 border rounded-md bg-background/30"
            >
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`step-${step.id}-name`}>Step Name</Label>
                    <Input
                      id={`step-${step.id}-name`}
                      value={step.name}
                      onChange={(e) => handleStepChange(step.id, 'name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`step-${step.id}-type`}>Step Type</Label>
                    <Select
                      value={step.type}
                      onValueChange={(value: WorkflowStepType) => handleStepChange(step.id, 'type', value)}
                    >
                      <SelectTrigger id={`step-${step.id}-type`}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="approval">Approval</SelectItem>
                        <SelectItem value="publish">Publish</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => handleMoveStep(step.id, 'up')}
                  disabled={step.order === 1}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => handleMoveStep(step.id, 'down')}
                  disabled={step.order === (workflowData.steps?.length || 0)}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => handleRemoveStep(step.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {(!workflowData.steps || workflowData.steps.length === 0) && (
            <div className="text-center py-8 text-muted-foreground border rounded-md">
              <p>No steps added yet</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleAddStep}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add First Step
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave}>Save Workflow</Button>
      </div>
    </div>
  );
};
