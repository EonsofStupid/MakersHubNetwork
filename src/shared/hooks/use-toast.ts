
export { useToast, toast } from '@/hooks/use-toast';
export type { ToastActionElement, ToastProps } from '@/hooks/use-toast';

// Add the missing ToastVariant type
export type ToastVariant = 'default' | 'destructive';
