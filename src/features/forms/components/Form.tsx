import { createContext, useContext, FormEvent, useEffect } from 'react';
import { FormContextValue, FormProviderProps, FormFieldProps } from '../types';
import { useForm } from '../hooks/useForm';
import { cn } from '@/app/utils/cn';
import { AnimatedComponent } from '@/features/components/animations/AnimatedComponent';

const FormContext = createContext<FormContextValue | null>(null);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

export const Form = ({ config, children }: FormProviderProps) => {
  const form = useForm(config);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await form.submit();
  };

  return (
    <FormContext.Provider value={form}>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        noValidate
      >
        {children}
      </form>
    </FormContext.Provider>
  );
};

export const FormField = ({ name, config, className }: FormFieldProps) => {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setTouched,
    register,
    unregister,
  } = useFormContext();

  // Register field on mount
  useEffect(() => {
    register(name, config);
    return () => unregister(name);
  }, [name, config, register, unregister]);

  const handleChange = (value: any) => {
    setValue(name, value);
  };

  const handleBlur = () => {
    setTouched(name);
  };

  const error = touched[name] ? errors[name] : null;
  const value = values[name];

  const renderField = () => {
    const commonProps = {
      id: name,
      name,
      disabled: config.disabled || isSubmitting,
      'aria-invalid': !!error,
      'aria-describedby': error ? `${name}-error` : undefined,
    };

    const commonClasses = cn(
      'w-full px-3 py-2 rounded-md',
      'bg-background border border-input',
      'focus:outline-none focus:ring-2 focus:ring-primary',
      error && 'border-destructive focus:ring-destructive',
      config.disabled && 'opacity-50 cursor-not-allowed',
      className
    );

    switch (config.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'date':
        return (
          <input
            {...commonProps}
            type={config.type}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder={config.placeholder}
            className={commonClasses}
          />
        );

      case 'textarea':
        return (
          <textarea
            {...commonProps}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder={config.placeholder}
            className={commonClasses}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              {...commonProps}
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleChange(e.target.checked)}
              onBlur={handleBlur}
              className={cn(
                'w-4 h-4 rounded',
                'border border-input',
                'focus:outline-none focus:ring-2 focus:ring-primary',
                error && 'border-destructive focus:ring-destructive',
                config.disabled && 'opacity-50 cursor-not-allowed'
              )}
            />
            {config.label && (
              <label
                htmlFor={name}
                className="ml-2 text-sm text-foreground"
              >
                {config.label}
              </label>
            )}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {config.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  {...commonProps}
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  className={cn(
                    'w-4 h-4',
                    'border border-input',
                    'focus:outline-none focus:ring-2 focus:ring-primary',
                    error && 'border-destructive focus:ring-destructive',
                    config.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                />
                <label
                  htmlFor={`${name}-${option.value}`}
                  className="ml-2 text-sm text-foreground"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case 'select':
        return (
          <select
            {...commonProps}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            className={commonClasses}
          >
            {config.placeholder && (
              <option value="" disabled>
                {config.placeholder}
              </option>
            )}
            {config.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {config.type !== 'checkbox' && config.label && (
        <label
          htmlFor={name}
          className={cn(
            'block text-sm font-medium text-foreground',
            error && 'text-destructive'
          )}
        >
          {config.label}
          {config.required && (
            <span className="ml-1 text-destructive">*</span>
          )}
        </label>
      )}

      {renderField()}

      <AnimatedComponent
        animation={{
          type: 'fade',
          direction: 'in',
          duration: 200,
        }}
      >
        {error && (
          <p
            id={`${name}-error`}
            className="text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
      </AnimatedComponent>
    </div>
  );
}; 