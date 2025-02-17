import { ReactNode } from 'react';

export type ValidationRule = {
  validate: (value: any, formValues?: Record<string, any>) => boolean;
  message: string;
};

export type FieldType = 'text' | 'number' | 'email' | 'password' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date';

export type FieldOption = {
  label: string;
  value: string | number;
};

export interface FieldConfig {
  type: FieldType;
  label?: string;
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  disabled?: boolean;
  rules?: ValidationRule[];
  dependencies?: string[];
  transform?: (value: any) => any;
  format?: (value: any) => any;
  options?: FieldOption[];
}

export interface FieldState {
  value: any;
  touched: boolean;
  dirty: boolean;
  error: string | null;
  isValidating: boolean;
}

export interface FormConfig {
  fields: Record<string, FieldConfig>;
  onSubmit?: (values: Record<string, any>) => void | Promise<void>;
  onError?: (errors: Record<string, string>) => void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  revalidateOnChange?: boolean;
  persistState?: boolean;
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
  dirty: Record<string, boolean>;
  isSubmitting: boolean;
  isValidating: boolean;
  submitCount: number;
  isValid: boolean;
}

export interface FormContextValue extends FormState {
  register: (name: string, config: FieldConfig) => void;
  unregister: (name: string) => void;
  setValue: (name: string, value: any, shouldValidate?: boolean) => void;
  setTouched: (name: string, touched?: boolean) => void;
  setError: (name: string, error: string | null) => void;
  validate: (fieldNames?: string[]) => Promise<boolean>;
  reset: (values?: Record<string, any>) => void;
  submit: () => Promise<void>;
}

export interface FormProviderProps {
  config: FormConfig;
  children: ReactNode;
}

export interface FormFieldProps {
  name: string;
  config: FieldConfig;
  className?: string;
}

export interface FormSubmitOptions {
  skipValidation?: boolean;
  resetOnSuccess?: boolean;
}

export interface FormHookConfig extends FormConfig {
  initialValues?: Record<string, any>;
  onStateChange?: (state: FormState) => void;
  transformSubmitData?: (values: Record<string, any>) => Record<string, any>;
} 