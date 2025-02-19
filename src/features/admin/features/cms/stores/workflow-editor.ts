
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Workflow, WorkflowField } from '../types/workflow';

interface WorkflowEditorState {
  currentWorkflow: Partial<Workflow> | null;
  isDirty: boolean;
  errors: Record<string, string>;
  setWorkflow: (workflow: Partial<Workflow> | null) => void;
  addField: (field: Partial<WorkflowField>) => void;
  updateField: (index: number, field: Partial<WorkflowField>) => void;
  removeField: (index: number) => void;
  moveField: (fromIndex: number, toIndex: number) => void;
  validateWorkflow: () => boolean;
}

export const useWorkflowEditor = create<WorkflowEditorState>((set, get) => ({
  currentWorkflow: null,
  isDirty: false,
  errors: {},

  setWorkflow: (workflow) => {
    set({ 
      currentWorkflow: workflow,
      isDirty: false,
      errors: {}
    });
  },

  addField: (field) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    const newField: WorkflowField = {
      id: uuidv4(),
      name: '',
      type: 'text',
      required: false,
      ...field
    };

    set({
      currentWorkflow: {
        ...currentWorkflow,
        fields: [...(currentWorkflow.fields || []), newField]
      },
      isDirty: true
    });
  },

  updateField: (index, field) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow?.fields) return;

    const updatedFields = [...currentWorkflow.fields];
    updatedFields[index] = {
      ...updatedFields[index],
      ...field
    };

    set({
      currentWorkflow: {
        ...currentWorkflow,
        fields: updatedFields
      },
      isDirty: true
    });
  },

  removeField: (index) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow?.fields) return;

    const updatedFields = currentWorkflow.fields.filter((_, i) => i !== index);
    set({
      currentWorkflow: {
        ...currentWorkflow,
        fields: updatedFields
      },
      isDirty: true
    });
  },

  moveField: (fromIndex, toIndex) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow?.fields) return;

    const fields = [...currentWorkflow.fields];
    const [removed] = fields.splice(fromIndex, 1);
    fields.splice(toIndex, 0, removed);

    set({
      currentWorkflow: {
        ...currentWorkflow,
        fields
      },
      isDirty: true
    });
  },

  validateWorkflow: () => {
    const { currentWorkflow } = get();
    const errors: Record<string, string> = {};

    if (!currentWorkflow?.name) {
      errors.name = 'Name is required';
    }

    if (!currentWorkflow?.fields?.length) {
      errors.fields = 'At least one field is required';
    }

    currentWorkflow?.fields?.forEach((field, index) => {
      if (!field.name) {
        errors[`field_${index}_name`] = 'Field name is required';
      }
      if (!field.type) {
        errors[`field_${index}_type`] = 'Field type is required';
      }
    });

    set({ errors });
    return Object.keys(errors).length === 0;
  }
}));
