import React from 'react';
import PropTypes from 'prop-types';

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
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-[var(--color-primary)] text-white hover:opacity-90 focus:ring-[var(--color-primary)]',
    secondary: 'bg-[var(--color-secondary)] text-white hover:opacity-90 focus:ring-[var(--color-secondary)]',
    danger: 'bg-[var(--color-danger)] text-white hover:opacity-90 focus:ring-[var(--color-danger)]',
    success: 'bg-[var(--color-success)] text-white hover:opacity-90 focus:ring-[var(--color-success)]',
    ghost: 'bg-transparent text-[var(--color-text)] hover:bg-[var(--color-bg)]',
    outline: 'bg-transparent border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg)] focus:ring-[var(--color-primary)]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${disabledClass} ${className}`}
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