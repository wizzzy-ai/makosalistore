import React, { useEffect, useRef } from 'react'

const BwConfirmDialog = ({
  open,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  tone = 'danger',
  onConfirm,
  onClose,
}) => {
  const confirmButtonRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const close = () => onClose && onClose()
    const onKeyDown = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'Enter') onConfirm && onConfirm()
    }

    window.addEventListener('keydown', onKeyDown)
    const t = window.setTimeout(() => confirmButtonRef.current?.focus?.(), 0)

    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onConfirm, onClose])

  if (!open) return null

  return (
    <div className="bw-modal" role="dialog" aria-modal="true" aria-label={title}>
      <button className="bw-modal__backdrop" type="button" onClick={onClose} aria-label="Close dialog" />
      <div className="bw-modal__panel">
        <div className="bw-modal__head">
          <div className="bw-modal__title">{title}</div>
          <button className="bw-modal__x" type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {message ? <div className="bw-modal__body">{message}</div> : null}

        <div className="bw-modal__actions">
          <button className="bw-btn bw-btn--ghost" type="button" onClick={onClose}>
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            className={tone === 'danger' ? 'bw-btn bw-btn--primary bw-btn--dangerSolid' : 'bw-btn bw-btn--primary'}
            type="button"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BwConfirmDialog
