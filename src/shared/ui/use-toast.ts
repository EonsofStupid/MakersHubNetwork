
// Re-export from components/ui/use-toast
import { useToast as useToastInternal, toast as toastInternal } from "@/components/ui/use-toast";
import { type ToastProps, type ToastActionElement } from "@/components/ui/toast";

export const useToast = useToastInternal;
export const toast = toastInternal;

// Re-export types for convenience
export type { ToastProps, ToastActionElement };
export type ToastVariant = "default" | "destructive" | "success" | "warning" | "info";
