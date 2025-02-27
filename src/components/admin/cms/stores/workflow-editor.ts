
import { create } from 'zustand';
import { Workflow, WorkflowStep } from '../types/workflow';

interface WorkflowEditorState {
  currentWorkflow: Workflow | null;
  isDirty: boolean;
  setWorkflow: (workflow: Workflow | null) => void;
  updateWorkflow: (updates: Partial<Workflow>) => void;
  addStep: (step: WorkflowStep) => void;
  updateStep: (stepId: string, updates: Partial<WorkflowStep>) => void;
  reorderStep: (stepId: string, newOrder: number) => void;
  removeStep: (stepId: string) => void;
  resetWorkflow: () => void;
}

export const useWorkflowEditorStore = create<WorkflowEditorState>((set, get) => ({
  currentWorkflow: null,
  isDirty: false,
  
  setWorkflow: (workflow) => {
    set({ 
      currentWorkflow: workflow,
      isDirty: false
    });
  },
  
  updateWorkflow: (updates) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;
    
    set({
      currentWorkflow: { ...currentWorkflow, ...updates },
      isDirty: true
    });
  },
  
  addStep: (step) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;
    
    const steps = [...(currentWorkflow.steps || []), step];
    
    set({
      currentWorkflow: { ...currentWorkflow, steps },
      isDirty: true
    });
  },
  
  updateStep: (stepId, updates) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow || !currentWorkflow.steps) return;
    
    const steps = currentWorkflow.steps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    );
    
    set({
      currentWorkflow: { ...currentWorkflow, steps },
      isDirty: true
    });
  },
  
  reorderStep: (stepId, newOrder) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow || !currentWorkflow.steps) return;
    
    const steps = [...currentWorkflow.steps];
    const stepIndex = steps.findIndex(step => step.id === stepId);
    
    if (stepIndex === -1) return;
    
    const step = steps[stepIndex];
    steps.splice(stepIndex, 1);
    steps.splice(newOrder - 1, 0, step);
    
    // Update all order values
    const updatedSteps = steps.map((s, index) => ({
      ...s,
      order: index + 1
    }));
    
    set({
      currentWorkflow: { ...currentWorkflow, steps: updatedSteps },
      isDirty: true
    });
  },
  
  removeStep: (stepId) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow || !currentWorkflow.steps) return;
    
    const steps = currentWorkflow.steps.filter(step => step.id !== stepId);
    
    // Update order values
    const updatedSteps = steps.map((step, index) => ({
      ...step,
      order: index + 1
    }));
    
    set({
      currentWorkflow: { ...currentWorkflow, steps: updatedSteps },
      isDirty: true
    });
  },
  
  resetWorkflow: () => {
    set({
      currentWorkflow: null,
      isDirty: false
    });
  }
}));
