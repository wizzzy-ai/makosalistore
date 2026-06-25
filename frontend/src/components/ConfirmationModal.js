import React from 'react'
import { FiLock } from 'react-icons/fi'
import './ConfirmationModal.css'

const ConfirmationModal = ({
  isOpen,
  onClose,
  title = 'Log Out?',
  description = 'Are you sure you want to log out of your account?',
  onConfirm,
  confirmLabel = 'Yes, Log Out',
  cancelLabel = 'Cancel',
}) => {
  if (!isOpen) return null

  return (
    <div className="confirmModal-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className="confirmModal">
        <button className="confirmModal-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="confirmModal-icon" aria-hidden="true">
          <FiLock />
        </div>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="confirmModal-actions">
          <button className="confirmModal-btn confirmModal-btn--cancel" type="button" onClick={onClose}>
            {cancelLabel}
          </button>
          <button className="confirmModal-btn confirmModal-btn--confirm" type="button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal

