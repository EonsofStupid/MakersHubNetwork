import { useCallback, useEffect, useState } from 'react';
import {
  FormHookConfig,
  FormState,
  FieldConfig,
  FormSubmitOptions,
} from '../types';
import {
  getInitialFormState,
  validateField,
  validateForm,
  isDirty,
  getFormStateFromStorage,
  saveFormStateToStorage,
  transformValue,
  formatValue,
} from '../utils/form-utils';

export const useForm = (config: FormHookConfig) => {
  // Initialize form state
  const [state, setState] = useState<FormState>(() => {
    const initialState = getInitialFormState(config.fields);
    
    if (config.persistState) {
      const storedState = getFormStateFromStorage(`form-${config.fields.toString()}`);
      if (storedState) {
        return {
          ...initialState,
          ...storedState,
          isSubmitting: false,
          isValidating: false,
        };
      }
    }

    if (config.initialValues) {
      return {
        ...initialState,
        values: { ...initialState.values, ...config.initialValues },
      };
    }

    return initialState;
  });

  // Track registered fields
  const [registeredFields, setRegisteredFields] = useState<
    Record<string, FieldConfig>
  >({});

  // Notify parent of state changes
  useEffect(() => {
    config.onStateChange?.(state);
  }, [state]);

  // Persist state changes
  useEffect(() => {
    if (config.persistState) {
      saveFormStateToStorage(`form-${config.fields.toString()}`, state);
    }
  }, [state.values, state.touched, state.dirty]);

  // Register a field
  const register = useCallback((name: string, fieldConfig: FieldConfig) => {
    setRegisteredFields((prev) => ({
      ...prev,
      [name]: fieldConfig,
    }));
  }, []);

  // Unregister a field
  const unregister = useCallback((name: string) => {
    setRegisteredFields((prev) => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  // Set field value
  const setValue = useCallback(
    async (name: string, value: any, shouldValidate = config.validateOnChange) => {
      const fieldConfig = registeredFields[name];
      if (!fieldConfig) return;

      const transformedValue = transformValue(
        value,
        fieldConfig.type,
        fieldConfig.transform
      );

      setState((prev) => ({
        ...prev,
        values: { ...prev.values, [name]: transformedValue },
        dirty: { ...prev.dirty, [name]: true },
      }));

      if (shouldValidate) {
        const error = await validateField(transformedValue, fieldConfig, state.values);
        setState((prev) => ({
          ...prev,
          errors: { ...prev.errors, [name]: error },
          isValid: !error && Object.values(prev.errors).every((e) => !e),
        }));
      }

      // Validate dependent fields
      if (fieldConfig.dependencies) {
        for (const dependentField of fieldConfig.dependencies) {
          const dependentConfig = registeredFields[dependentField];
          if (dependentConfig) {
            const dependentError = await validateField(
              state.values[dependentField],
              dependentConfig,
              { ...state.values, [name]: transformedValue }
            );
            setState((prev) => ({
              ...prev,
              errors: { ...prev.errors, [dependentField]: dependentError },
            }));
          }
        }
      }
    },
    [config.validateOnChange, registeredFields, state.values]
  );

  // Set field touched state
  const setTouched = useCallback(
    async (name: string, touched = true) => {
      setState((prev) => ({
        ...prev,
        touched: { ...prev.touched, [name]: touched },
      }));

      if (config.validateOnBlur) {
        const fieldConfig = registeredFields[name];
        if (fieldConfig) {
          const error = await validateField(state.values[name], fieldConfig, state.values);
          setState((prev) => ({
            ...prev,
            errors: { ...prev.errors, [name]: error },
            isValid: !error && Object.values(prev.errors).every((e) => !e),
          }));
        }
      }
    },
    [config.validateOnBlur, registeredFields, state.values]
  );

  // Set field error
  const setError = useCallback((name: string, error: string | null) => {
    setState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [name]: error },
      isValid: !error && Object.values(prev.errors).every((e) => !e),
    }));
  }, []);

  // Validate form or specific fields
  const validate = useCallback(
    async (fieldNames?: string[]): Promise<boolean> => {
      setState((prev) => ({ ...prev, isValidating: true }));

      try {
        const fieldsToValidate = fieldNames
          ? Object.entries(registeredFields).filter(([name]) =>
              fieldNames.includes(name)
            )
          : Object.entries(registeredFields);

        const errors: Record<string, string | null> = {};
        const validations = fieldsToValidate.map(async ([name, config]) => {
          errors[name] = await validateField(state.values[name], config, state.values);
        });

        await Promise.all(validations);

        const isValid = Object.values(errors).every((error) => !error);
        setState((prev) => ({
          ...prev,
          errors,
          isValid,
          isValidating: false,
        }));

        return isValid;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isValidating: false,
          isValid: false,
        }));
        return false;
      }
    },
    [registeredFields, state.values]
  );

  // Reset form
  const reset = useCallback(
    (values?: Record<string, any>) => {
      const initialState = getInitialFormState(config.fields);
      setState({
        ...initialState,
        values: values || initialState.values,
      });
    },
    [config.fields]
  );

  // Submit form
  const submit = useCallback(
    async (options: FormSubmitOptions = {}) => {
      if (state.isSubmitting) return;

      setState((prev) => ({
        ...prev,
        isSubmitting: true,
        submitCount: prev.submitCount + 1,
      }));

      try {
        // Validate unless explicitly skipped
        if (!options.skipValidation) {
          const isValid = await validate();
          if (!isValid) {
            setState((prev) => ({ ...prev, isSubmitting: false }));
            config.onError?.(state.errors);
            return;
          }
        }

        // Transform data if needed
        const submitData = config.transformSubmitData
          ? config.transformSubmitData(state.values)
          : state.values;

        // Submit
        await config.onSubmit?.(submitData);

        // Reset if requested
        if (options.resetOnSuccess) {
          reset();
        }
      } catch (error) {
        console.error('Form submission error:', error);
        config.onError?.(
          { submit: error instanceof Error ? error.message : 'Submission failed' }
        );
      } finally {
        setState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [state, config, validate, reset]
  );

  return {
    ...state,
    register,
    unregister,
    setValue,
    setTouched,
    setError,
    validate,
    reset,
    submit,
  };
}; 