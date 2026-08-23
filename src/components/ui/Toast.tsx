import React, { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2Icon, XCircleIcon, InfoIcon, XIcon } from 'lucide-react';

type ToastKind = 'success' | 'error' | 'info';
interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  message?: string;
}

const ToastContext = createContext<(kind: ToastKind, title: string, message?: string) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

const styles: Record<ToastKind, {icon: React.ComponentType<{className?: string;}>;cls: string;}> = {
  success: { icon: CheckCircle2Icon, cls: 'text-sage' },
  error: { icon: XCircleIcon, cls: 'text-danger' },
  info: { icon: InfoIcon, cls: 'text-brown' }
};

export function ToastProvider({ children }: {children: React.ReactNode;}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((kind: ToastKind, title: string, message?: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, title, message }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-[340px] flex-col gap-2" aria-live="polite">
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const { icon: Icon, cls } = styles[t.kind];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="pointer-events-auto flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5 shadow-pop">
                
                <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${cls}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{t.title}</p>
                  {t.message ? <p className="mt-0.5 text-[13px] leading-snug text-ink-50">{t.message}</p> : null}
                </div>
                <button
                  onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
                  aria-label="Dismiss notification"
                  className="rounded p-1 text-ink-30 transition-colors duration-150 ease-out hover:text-ink">
                  
                  <XIcon className="h-3.5 w-3.5" />
                </button>
              </motion.div>);

          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>);

}