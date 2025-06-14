import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = '',
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-40 px-2 py-8">
      <div className={`relative w-full max-w-lg mx-auto bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-xl transition-all ${sizes[size]} ${className}`}>
          {title && (
          <div className="border-b border-[var(--color-border)] px-6 py-4 rounded-t-xl bg-[var(--color-surface)]">
            <h3 className="text-lg font-semibold text-[var(--color-text)]">{title}</h3>
            </div>
          )}
        <div className="px-6 py-4 text-[var(--color-text)]">{children}</div>
          {footer && (
          <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-4 rounded-b-xl">{footer}</div>
          )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl']),
  className: PropTypes.string,
};

export default Modal; 