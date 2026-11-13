import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Toast } from '../components/ui/Toast.jsx';
import { ToastContext } from './toastContext.js';

/**
 * Mount once at the app root. Toasts stack bottom-right (bottom on mobile),
 * announce politely, and remove themselves after `duration` ms.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    ({ title, description, variant = 'info', duration = 4000 }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((current) => [...current, { id, title, description, variant }]);

      if (duration > 0) {
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), duration),
        );
      }

      return id;
    },
    [dismiss],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  const value = useMemo(() => toast, [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div
          aria-live="polite"
          aria-label="Notifications"
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[120] flex flex-col items-center gap-3 p-4 sm:items-end sm:p-6"
        >
          {toasts.map((item) => (
            <Toast
              key={item.id}
              title={item.title}
              description={item.description}
              variant={item.variant}
              onDismiss={() => dismiss(item.id)}
            />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
