import { useCallback } from 'react';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

let subscribers: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

export function useToast() {
  // Use state only if we need to force re-renders, but here we just return the toast function

  const toast = useCallback(({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, title, description, variant };
    toasts = [...toasts, newToast];
    subscribers.forEach(sub => sub(toasts));
    
    setTimeout(() => {
      toasts = toasts.filter(t => t.id !== id);
      subscribers.forEach(sub => sub(toasts));
    }, 3000);
  }, []);

  return { toast };
}

// Simple subscriber for the Toaster component
export function subscribeToToasts(callback: (toasts: Toast[]) => void) {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter(sub => sub !== callback);
  };
}
