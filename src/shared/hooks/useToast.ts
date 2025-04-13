
import { useState } from 'react';

export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: ToastVariant;
  icon?: string;
  duration?: number;
}

export type ToastActionElement = React.ReactElement<{
  altText: string;
  onClick: () => void;
}>;

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = ({
    title,
    description,
    variant = 'default',
    action,
    icon,
    duration = 5000,
  }: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = {
      id,
      title,
      description,
      variant,
      action,
      icon,
      duration,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss
    if (duration !== Infinity) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }

    return id;
  };

  const dismiss = (toastId: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  };

  return {
    toast,
    dismiss,
    toasts,
  };
}

// Re-export toast function for convenience
export const toast = (props: Omit<ToastProps, 'id'>) => {
  const { toast: toastFn } = useToast();
  return toastFn(props);
};
