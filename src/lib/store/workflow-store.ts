import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

interface WorkflowState {
  activeWorkflows: Record<string, any>;
  workflowHistory: Record<string, any[]>;
  setActiveWorkflow: (id: string, data: any) => void;
  addToHistory: (id: string, data: any) => void;
  clearWorkflowHistory: (id: string) => void;
  reset: () => void;
}

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      activeWorkflows: {},
      workflowHistory: {},
      setActiveWorkflow: (id, data) => 
        set((state) => ({ 
          activeWorkflows: { ...state.activeWorkflows, [id]: data }
        })),
      addToHistory: (id, data) =>
        set((state) => ({
          workflowHistory: {
            ...state.workflowHistory,
            [id]: [...(state.workflowHistory[id] || []), data]
          }
        })),
      clearWorkflowHistory: (id) =>
        set((state) => {
          const { [id]: _, ...rest } = state.workflowHistory;
          return { workflowHistory: rest };
        }),
      reset: () => set({ activeWorkflows: {}, workflowHistory: {} }),
    }),
    {
      name: 'workflow-storage',
      partialize: (state) => ({ 
        activeWorkflows: state.activeWorkflows,
        workflowHistory: state.workflowHistory 
      }),
    }
  )
);