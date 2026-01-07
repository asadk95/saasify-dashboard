import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { Modal, Button } from '../common';
import './ConfirmDialog.css';

const variants = {
  danger: {
    icon: AlertTriangle,
    color: 'var(--error)',
    bgColor: 'var(--error-light)',
    confirmVariant: 'danger',
  },
  warning: {
    icon: AlertTriangle,
    color: 'var(--warning)',
    bgColor: 'var(--warning-light)',
    confirmVariant: 'primary',
  },
  success: {
    icon: CheckCircle,
    color: 'var(--success)',
    bgColor: 'var(--success-light)',
    confirmVariant: 'primary',
  },
  info: {
    icon: Info,
    color: 'var(--info)',
    bgColor: 'var(--info-light)',
    confirmVariant: 'primary',
  },
};

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  const config = variants[variant] || variants.danger;
  const Icon = config.icon;

  const handleConfirm = async () => {
    await onConfirm?.();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="confirm-dialog">
        <div
          className="confirm-icon"
          style={{ backgroundColor: config.bgColor }}
        >
          <Icon size={24} color={config.color} />
        </div>

        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>

        <div className="confirm-actions">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={config.confirmVariant}
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
