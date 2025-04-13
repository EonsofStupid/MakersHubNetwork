
// Import from the Shadcn UI components
import { useToast as useShadcnToast, toast as shadcnToast } from '@/shared/ui/use-toast';
import { type ToastProps } from '@/shared/ui/toast';

// Re-export with the same interface
export const useToast = useShadcnToast;
export const toast = shadcnToast;

// Re-export types
export type { ToastProps };
