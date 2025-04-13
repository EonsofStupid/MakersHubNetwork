
import { useCallback } from "react";

export type ToastVariant = "default" | "destructive" | "success" | "info" | "warning";

export interface Toast {
  id: string;
  title?: string;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
  action?: React.ReactNode;
}

export type ToastOptions = Omit<Toast, "id">;

export interface ToastActionElement {
  altText: string;
}

export interface ToastProps extends Toast {
  onOpenChange: (open: boolean) => void;
}

// Mock implementation for the toast functions
export const useToast = () => {
  const toast = useCallback((options: ToastOptions) => {
    console.log("Toast:", options);
    return { id: `toast-${Date.now()}`, ...options };
  }, []);

  const dismiss = useCallback((id?: string) => {
    console.log("Dismiss toast:", id);
  }, []);

  return {
    toast,
    dismiss,
  };
};

export const toast = (options: ToastOptions) => {
  console.log("Toast:", options);
  return { id: `toast-${Date.now()}`, ...options };
};
