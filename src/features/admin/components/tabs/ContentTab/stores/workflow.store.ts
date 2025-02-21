
import { create } from 'zustand';
import { Workflow } from '../types/content.types';

interface WorkflowState {
  workflows: Workflow[];
  selectedWorkflow: string | null;
  setWorkflows: (workflows: Workflow[]) => void;
  setSelectedWorkflow: (id: string | null) => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  workflows: [],
  selectedWorkflow: null,
  setWorkflows: (workflows) => set({ workflows }),
  setSelectedWorkflow: (id) => set({ selectedWorkflow: id }),
}));
