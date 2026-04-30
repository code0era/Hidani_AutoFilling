import { useEffect, useState } from 'react';
import { subscribeToToasts } from './use-toast';

export function Toaster() {
  const [toasts, setToasts] = useState<any[]>([]);

  useEffect(() => {
    return subscribeToToasts(setToasts);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-[320px]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg border animate-in slide-in-from-right-full duration-300 ${
            toast.variant === 'destructive' 
              ? 'bg-destructive text-destructive-foreground border-destructive' 
              : 'bg-card text-card-foreground border-border'
          }`}
        >
          {toast.title && <div className="font-bold text-sm">{toast.title}</div>}
          {toast.description && <div className="text-xs opacity-90">{toast.description}</div>}
        </div>
      ))}
    </div>
  );
}
