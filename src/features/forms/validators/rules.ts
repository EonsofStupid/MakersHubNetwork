import { ValidationRule } from '../types';

export const required: ValidationRule = {
  validate: (value: any) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return true;
    if (typeof value === 'boolean') return true;
    return value != null;
  },
  message: 'This field is required',
};

export const email: ValidationRule = {
  validate: (value: string) => {
    if (!value) return true;
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
  },
  message: 'Invalid email address',
};

export const minLength = (min: number): ValidationRule => ({
  validate: (value: string | any[]) => {
    if (!value) return true;
    return value.length >= min;
  },
  message: `Must be at least ${min} characters`,
});

export const maxLength = (max: number): ValidationRule => ({
  validate: (value: string | any[]) => {
    if (!value) return true;
    return value.length <= max;
  },
  message: `Must be no more than ${max} characters`,
});

export const min = (min: number): ValidationRule => ({
  validate: (value: number) => {
    if (value === null || value === undefined) return true;
    return value >= min;
  },
  message: `Must be at least ${min}`,
});

export const max = (max: number): ValidationRule => ({
  validate: (value: number) => {
    if (value === null || value === undefined) return true;
    return value <= max;
  },
  message: `Must be no more than ${max}`,
});

export const pattern = (regex: RegExp, message: string): ValidationRule => ({
  validate: (value: string) => {
    if (!value) return true;
    return regex.test(value);
  },
  message,
});

export const match = (field: string, fieldLabel?: string): ValidationRule => ({
  validate: (value: any, formValues?: Record<string, any>) => {
    if (!value || !formValues) return true;
    return value === formValues[field];
  },
  message: `Must match ${fieldLabel || field}`,
});

export const url: ValidationRule = {
  validate: (value: string) => {
    if (!value) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  message: 'Invalid URL',
};

export const numeric: ValidationRule = {
  validate: (value: string) => {
    if (!value) return true;
    return /^\d+$/.test(value);
  },
  message: 'Must be a number',
};

export const alpha: ValidationRule = {
  validate: (value: string) => {
    if (!value) return true;
    return /^[A-Za-z]+$/.test(value);
  },
  message: 'Must contain only letters',
};

export const alphanumeric: ValidationRule = {
  validate: (value: string) => {
    if (!value) return true;
    return /^[A-Za-z0-9]+$/.test(value);
  },
  message: 'Must contain only letters and numbers',
}; 