
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

// Toast types
export type ToastVariant = "default" | "destructive" | "success" | "warning" | "info";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
  icon?: string;
}

export type ToasterToastProps = Toast;

export interface ToastActionElement {
  altText: string;
  action: () => void;
  element: React.ReactNode;
}

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 300;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const updateToast = useCallback((toast: Toast) => {
    setToasts((prevToasts) => {
      const existingToast = prevToasts.find((t) => t.id === toast.id);
      if (existingToast) {
        return prevToasts.map((t) => (t.id === toast.id ? { ...t, ...toast } : t));
      }
      return [toast, ...prevToasts].slice(0, TOAST_LIMIT);
    });
  }, []);

  const addToast = useCallback(
    (props: Omit<Toast, "id">) => {
      const id = uuidv4();
      const newToast = { id, ...props };
      updateToast(newToast);
      return id;
    },
    [updateToast]
  );

  const dismissToast = useCallback(
    (toastId: string) => {
      setToasts((prevToasts) => {
        const targetToast = prevToasts.find((t) => t.id === toastId);
        if (!targetToast) return prevToasts;

        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toastId));
        }, TOAST_REMOVE_DELAY);

        return prevToasts;
      });
    },
    []
  );

  const toast = useCallback(
    (props: Omit<Toast, "id">) => {
      const defaultDuration = props.variant === "destructive" ? 5000 : 3000;
      const id = addToast({ ...props, duration: props.duration || defaultDuration });
      return id;
    },
    [addToast]
  );

  return {
    toast,
    toasts,
    dismiss: dismissToast,
  };
}

export { toast } from "@/components/ui/sonner";
