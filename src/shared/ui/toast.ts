
// Re-export from components/ui/toast
export { 
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from "@/components/ui/toast";

// Also export ToastVariant type
export type ToastVariant = "default" | "destructive" | "success";
