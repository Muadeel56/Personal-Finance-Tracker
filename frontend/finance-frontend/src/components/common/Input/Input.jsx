import React from 'react';
import PropTypes from 'prop-types';

const Input = ({
  type = 'text',
  label,
  error,
  helperText,
  fullWidth = false,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'block w-full rounded-md border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 transition px-3 py-2 sm:text-sm';
  const errorStyles = 'border-[var(--color-danger, #ef4444)] text-[var(--color-danger, #ef4444)] placeholder-[var(--color-danger, #ef4444)] focus:border-[var(--color-danger, #ef4444)] focus:ring-[var(--color-danger, #ef4444)]';
  const disabledStyles = 'bg-[var(--color-muted)] bg-opacity-10 cursor-not-allowed';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div className={`${widthClass} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
          {label}
          {required && <span className="text-[var(--color-danger, #ef4444)] ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`
          ${baseStyles}
          ${error ? errorStyles : ''}
          ${disabled ? disabledStyles : ''}
          ${widthClass}
        `}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id}-error` : undefined}
        {...props}
      />
      {(error || helperText) && (
        <p
          className={`mt-1 text-sm ${error ? 'text-[var(--color-danger, #ef4444)]' : 'text-[var(--color-muted)]'}`}
          id={error ? `${props.id}-error` : undefined}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
};

export default Input; 