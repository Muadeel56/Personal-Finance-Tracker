import PropTypes from 'prop-types';

const Card = ({ children, title, subtitle, footer, className = '', padding = '22px', ...props }) => {
  return (
    <div className={`card ${className}`} style={{ padding }} {...props}>
      {(title || subtitle) && (
        <div style={{ marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)' }}>
          {title && (
            <h3 style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: 0 }}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p style={{ marginTop: '4px', fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
      {footer && (
        <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
          {footer}
        </div>
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
  padding: PropTypes.string,
};

export default Card;
