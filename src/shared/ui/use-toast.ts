
// Re-export use-toast hook and types from shadcn
import {
  useToast,
  toast,
  type ToastActionElement,
  type ToastProps
} from "@/components/ui/use-toast";

// Re-export all
export {
  useToast,
  toast,
  type ToastActionElement,
  type ToastProps
};

// Export type for toast variant
export type { ToastVariant } from '@/components/ui/toast';
