import React from 'react';
import PropTypes from 'prop-types';

const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  ...props
}) => {
  return (
    <div className={`bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow p-4 sm:p-6 transition-colors ${className}`} {...props}>
      {(title || subtitle) && (
        <div className="px-2 sm:px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] rounded-t-xl">
          {title && <h3 className="text-lg font-semibold text-[var(--color-text)]">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-[var(--color-muted)]">{subtitle}</p>}
        </div>
      )}
      <div className="px-2 sm:px-6 py-4">{children}</div>
      {footer && (
        <div className="px-2 sm:px-6 py-4 bg-[var(--color-card)] border-t border-[var(--color-border)] rounded-b-xl">{footer}</div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  footer: PropTypes.node,
  className: PropTypes.string,
};

export default Card; 