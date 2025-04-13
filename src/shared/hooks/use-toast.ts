
// Import from the Shadcn UI components via shared/ui to maintain boundary layers
import { useToast, toast, ToastProps, ToastActionElement, ToastVariant } from '@/shared/ui/use-toast';

// Export everything
export { 
  useToast, 
  toast 
};

// Re-export types
export type { 
  ToastProps, 
  ToastActionElement,
  ToastVariant
};
