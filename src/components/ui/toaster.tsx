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
          className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-2xl animate-in slide-in-from-right-full duration-500 min-w-[300px] ${
            toast.variant === 'success' 
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
              : toast.variant === 'destructive' || toast.variant === 'error'
              ? 'bg-rose-50 text-rose-900 border-rose-200'
              : 'bg-blue-50 text-blue-900 border-blue-200'
          }`}

        >
          <div className="flex flex-col gap-1">
            {toast.title && <div className="font-black text-sm tracking-tight leading-none">{toast.title}</div>}
            {toast.description && <div className="text-[11px] font-medium opacity-80 leading-relaxed">{toast.description}</div>}
          </div>
        </div>

      ))}
    </div>
  );
}
