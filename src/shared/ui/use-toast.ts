
// Re-export from shared/hooks/use-toast
import { useToast, toast } from "@/shared/hooks/use-toast";
import type { ToastProps, ToastActionElement, ToastVariant } from "@/shared/hooks/use-toast";

export { useToast, toast };

// Re-export types for convenience
export type { ToastProps, ToastActionElement, ToastVariant };
