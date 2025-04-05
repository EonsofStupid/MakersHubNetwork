
import { useState } from 'react';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
  icon?: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);
  
  const toast = (options: ToastOptions) => {
    // In a real implementation, this would add a toast to the UI
    console.log('Toast:', options);
    setToasts(prev => [...prev, options]);
    
    // Auto-remove toast after duration
    if (options.duration !== Infinity) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t !== options));
      }, options.duration || 5000);
    }
  };
  
  return { toast, toasts };
}
