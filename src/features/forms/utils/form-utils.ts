import { FieldConfig, FieldState, FormState, ValidationRule } from '../types';

export const getInitialFieldState = (config: FieldConfig): FieldState => ({
  value: config.defaultValue ?? null,
  touched: false,
  dirty: false,
  error: null,
  isValidating: false,
});

export const getInitialFormState = (fields: Record<string, FieldConfig>): FormState => {
  const initialState: FormState = {
    values: {},
    errors: {},
    touched: {},
    dirty: {},
    isSubmitting: false,
    isValidating: false,
    submitCount: 0,
    isValid: true,
  };

  Object.entries(fields).forEach(([name, config]) => {
    initialState.values[name] = config.defaultValue ?? null;
    initialState.errors[name] = null;
    initialState.touched[name] = false;
    initialState.dirty[name] = false;
  });

  return initialState;
};

export const validateField = async (
  value: any,
  config: FieldConfig,
  formValues?: Record<string, any>
): Promise<string | null> => {
  if (!config.rules) return null;

  for (const rule of config.rules) {
    const isValid = await Promise.resolve(rule.validate(value, formValues));
    if (!isValid) return rule.message;
  }

  return null;
};

export const validateForm = async (
  values: Record<string, any>,
  fields: Record<string, FieldConfig>
): Promise<Record<string, string | null>> => {
  const errors: Record<string, string | null> = {};
  const validations = Object.entries(fields).map(async ([name, config]) => {
    errors[name] = await validateField(values[name], config, values);
  });

  await Promise.all(validations);
  return errors;
};

export const isDirty = (
  currentValues: Record<string, any>,
  initialValues: Record<string, any>
): boolean => {
  return Object.keys(currentValues).some(
    (key) => currentValues[key] !== initialValues[key]
  );
};

export const getFormStateFromStorage = (storageKey: string): Partial<FormState> | null => {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to get form state from storage:', error);
    return null;
  }
};

export const saveFormStateToStorage = (
  storageKey: string,
  state: FormState
): void => {
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        values: state.values,
        touched: state.touched,
        dirty: state.dirty,
      })
    );
  } catch (error) {
    console.error('Failed to save form state to storage:', error);
  }
};

export const transformValue = (
  value: any,
  type: FieldConfig['type'],
  transform?: (value: any) => any
): any => {
  if (transform) return transform(value);

  switch (type) {
    case 'number':
      return value === '' ? null : Number(value);
    case 'checkbox':
      return Boolean(value);
    case 'date':
      return value ? new Date(value) : null;
    default:
      return value;
  }
};

export const formatValue = (
  value: any,
  type: FieldConfig['type'],
  format?: (value: any) => any
): any => {
  if (format) return format(value);
  if (value === null || value === undefined) return '';

  switch (type) {
    case 'date':
      return value instanceof Date
        ? value.toISOString().split('T')[0]
        : value;
    default:
      return String(value);
  }
}; 