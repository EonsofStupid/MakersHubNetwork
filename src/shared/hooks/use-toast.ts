
// Re-export toast hook from shadcn
import { toast } from '@/components/ui/use-toast';
import type { ToastActionElement, ToastProps } from '@/components/ui/toast';

export { toast, type ToastActionElement, type ToastProps };

// Add export for useToast for compatibility
export const useToast = () => {
  return {
    toast
  };
};

export type { ToastVariant } from '@/components/ui/toast';
