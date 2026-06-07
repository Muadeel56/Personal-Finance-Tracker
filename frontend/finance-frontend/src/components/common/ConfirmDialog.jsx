import React from 'react';
import { createPortal } from 'react-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  const confirmBtnClass = variant === 'danger' ? 'btn btn-danger' : 'btn btn-primary';

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '420px',
          background: 'var(--surface-1)',
          border: 'var(--card-border)',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: 'var(--card-shadow)',
        }}
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--expense-muted)',
            }}
          >
            <ExclamationTriangleIcon className="h-5 w-5" style={{ color: 'var(--expense)' }} />
          </div>
          <div>
            <h3
              id="confirm-dialog-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: '0 0 8px 0',
              }}
            >
              {title}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
              {message}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className={confirmBtnClass} style={{ flex: 1 }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmDialog;
