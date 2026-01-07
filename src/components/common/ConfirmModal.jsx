import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import './ConfirmModal.css';

/**
 * ConfirmModal - Reusable confirmation dialog for destructive actions
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Called when modal is closed
 * @param {function} onConfirm - Called when action is confirmed
 * @param {string} title - Modal title
 * @param {string} message - Descriptive message
 * @param {string} confirmText - Text for confirm button
 * @param {string} cancelText - Text for cancel button
 * @param {string} variant - 'danger' for destructive actions
 * @param {boolean} loading - Shows loading state on confirm button
 */
export default function ConfirmModal({
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
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="confirm-modal">
        <div className={`confirm-modal-icon ${variant}`}>
          <AlertTriangle size={32} />
        </div>
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-actions">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
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
