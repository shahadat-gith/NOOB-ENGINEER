import { createContext, useContext } from 'react';

export const ToastContext = createContext(null);

/** Call `toast({ title, description, variant })` from any component under ToastProvider. */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}
