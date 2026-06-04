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
  return (
    <div style={fullWidth ? { width: '100%' } : {}} className={className}>
      {label && (
        <label className="field-label">
          {label}
          {required && <span style={{ color: 'var(--expense)', marginLeft: '3px' }}>*</span>}
        </label>
      )}
      <div className={`field ${error ? 'error' : ''}`} style={disabled ? { opacity: 0.6 } : {}}>
        <input
          type={type}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
      </div>
      {(error || helperText) && (
        <p
          style={{ marginTop: '4px', fontSize: '12px', color: error ? 'var(--expense)' : 'var(--text-muted)' }}
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
