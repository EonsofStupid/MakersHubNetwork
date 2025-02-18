
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { WorkflowField, Workflow } from '../types/workflow';
import { WorkflowFieldType } from '../types/workflow-enums';

interface WorkflowEditorState {
  currentWorkflow: Partial<Workflow> | null;
  isDirty: boolean;
  errors: Record<string, string>;
  
  // Actions
  setWorkflow: (workflow: Partial<Workflow>) => void;
  addField: (type: WorkflowFieldType) => void;
  updateField: (fieldId: string, updates: Partial<WorkflowField>) => void;
  removeField: (fieldId: string) => void;
  moveField: (fromIndex: number, toIndex: number) => void;
  validateWorkflow: () => boolean;
  resetWorkflow: () => void;
}

export const useWorkflowEditor = create<WorkflowEditorState>((set, get) => ({
  currentWorkflow: null,
  isDirty: false,
  errors: {},

  setWorkflow: (workflow) => {
    set({ currentWorkflow: workflow, isDirty: false, errors: {} });
  },

  addField: (type) => {
    set((state) => {
      if (!state.currentWorkflow) return state;

      const newField: WorkflowField = {
        id: uuidv4(),
        name: '',
        type,
        required: false
      };

      return {
        currentWorkflow: {
          ...state.currentWorkflow,
          fields: [...(state.currentWorkflow.fields || []), newField]
        },
        isDirty: true
      };
    });
  },

  updateField: (fieldId, updates) => {
    set((state) => {
      if (!state.currentWorkflow?.fields) return state;

      const fieldIndex = state.currentWorkflow.fields.findIndex(f => f.id === fieldId);
      if (fieldIndex === -1) return state;

      const updatedFields = [...state.currentWorkflow.fields];
      updatedFields[fieldIndex] = {
        ...updatedFields[fieldIndex],
        ...updates
      };

      return {
        currentWorkflow: {
          ...state.currentWorkflow,
          fields: updatedFields
        },
        isDirty: true
      };
    });
  },

  removeField: (fieldId) => {
    set((state) => {
      if (!state.currentWorkflow?.fields) return state;

      return {
        currentWorkflow: {
          ...state.currentWorkflow,
          fields: state.currentWorkflow.fields.filter(f => f.id !== fieldId)
        },
        isDirty: true
      };
    });
  },

  moveField: (fromIndex, toIndex) => {
    set((state) => {
      if (!state.currentWorkflow?.fields) return state;

      const fields = [...state.currentWorkflow.fields];
      const [removed] = fields.splice(fromIndex, 1);
      fields.splice(toIndex, 0, removed);

      return {
        currentWorkflow: {
          ...state.currentWorkflow,
          fields
        },
        isDirty: true
      };
    });
  },

  validateWorkflow: () => {
    const { currentWorkflow } = get();
    const errors: Record<string, string> = {};

    if (!currentWorkflow?.name) {
      errors.name = 'Workflow name is required';
    }

    if (!currentWorkflow?.fields?.length) {
      errors.fields = 'At least one field is required';
    } else {
      // Validate fields
      const fieldNames = new Set();
      currentWorkflow.fields.forEach((field, index) => {
        if (!field.name) {
          errors[`fields.${index}.name`] = 'Field name is required';
        } else if (fieldNames.has(field.name)) {
          errors[`fields.${index}.name`] = 'Field names must be unique';
        }
        fieldNames.add(field.name);
      });
    }

    set({ errors });
    return Object.keys(errors).length === 0;
  },

  resetWorkflow: () => {
    set({
      currentWorkflow: null,
      isDirty: false,
      errors: {}
    });
  }
}));
