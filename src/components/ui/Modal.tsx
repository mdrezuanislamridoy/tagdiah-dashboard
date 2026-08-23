import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon, AlertTriangleIcon } from 'lucide-react';
import { Button } from './Button';

export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  children,
  width = 'max-w-lg'








}: {open: boolean;onClose: () => void;title: string;description?: string;footer?: React.ReactNode;children?: React.ReactNode;width?: string;}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ?
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div
          className="absolute inset-0 bg-ink/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          onClick={onClose} />
        
          <motion.div
          className={`relative w-full ${width} overflow-hidden rounded-2xl border border-line bg-surface shadow-pop`}
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
          
            <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
              <div>
                <h2 className="font-display text-lg leading-tight text-ink">{title}</h2>
                {description ? <p className="mt-1 text-[13px] text-ink-50">{description}</p> : null}
              </div>
              <button
              onClick={onClose}
              aria-label="Close dialog"
              className="rounded-md p-1.5 text-ink-50 transition-colors duration-150 ease-out hover:bg-cream hover:text-ink">
              
                <XIcon className="h-4 w-4" />
              </button>
            </header>
            {children ? <div className="max-h-[60vh] overflow-y-auto scroll-thin px-5 py-5">{children}</div> : null}
            {footer ? <footer className="flex justify-end gap-2 border-t border-line bg-cream/40 px-5 py-3.5">{footer}</footer> : null}
          </motion.div>
        </div> :
      null}
    </AnimatePresence>);

}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete',
  destructive = true








}: {open: boolean;onClose: () => void;onConfirm: () => void;title: string;message: string;confirmLabel?: string;destructive?: boolean;}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      width="max-w-md"
      footer={
      <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={destructive ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }>
      
      <div className="flex gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          destructive ? 'bg-danger-tint text-danger' : 'bg-gold-tint text-gold'}`
          }>
          
          <AlertTriangleIcon className="h-5 w-5" />
        </span>
        <p className="pt-1.5 text-sm text-ink-70">{message}</p>
      </div>
    </Modal>);

}