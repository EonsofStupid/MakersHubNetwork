import React from 'react';

export interface InputProps {
  type?: 'text' | 'password' | 'email' | 'number';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder = '',
  label,
  error,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`input-container ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`input ${error ? 'input-error' : ''}`}
      />
      {error && <div className="input-error-message">{error}</div>}
    </div>
  );
};

export default Input; 