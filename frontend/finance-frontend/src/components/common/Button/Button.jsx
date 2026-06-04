import PropTypes from 'prop-types';

const VARIANT_MAP = {
  primary:   'btn btn-primary',
  secondary: 'btn btn-secondary',
  ghost:     'btn btn-ghost',
  outline:   'btn btn-secondary',
  danger:    'btn btn-danger',
  success:   'btn btn-primary',
};

const SIZE_MAP = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const variantClass = VARIANT_MAP[variant] || VARIANT_MAP.primary;
  const sizeClass    = SIZE_MAP[size] || '';
  const widthStyle   = fullWidth ? { width: '100%' } : {};
  const disabledStyle = disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {};

  return (
    <button
      type={type}
      className={`${variantClass} ${sizeClass} ${className}`.trim()}
      style={{ ...widthStyle, ...disabledStyle }}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success', 'ghost', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
};

export default Button;
