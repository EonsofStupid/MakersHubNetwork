
// Central export file for all UI components
// This allows importing components from '@/shared/ui' instead of individual files

// Layout Components
export * from './accordion';
export * from './alert';
export * from './alert-dialog';
export * from './avatar';
export * from './badge';
export * from './breadcrumb';
export * from './button';
export * from './card';
export * from './dialog';
export * from './popover';
export * from './separator';
export * from './sheet';
export * from './tabs';
export * from './resizable';

// Form Components
export * from './checkbox';
export * from './form';
export * from './input';
export * from './label';
export * from './radio-group';
export * from './select'; // Now properly exported
export * from './slider';
export * from './switch';
export * from './textarea';

// Data Display
export * from './calendar';
export * from './hover-card';
export * from './progress';
export * from './skeleton';
export * from './table';
export * from './tooltip';

// Navigation
export * from './navigation-menu';
export * from './pagination';
export * from './scroll-area';

// Feedback
export * from './spinner';
export * from './toast';
export * from './toaster';
export * from './use-toast';
export * from './sonner';

// Re-export types explicitly to avoid ambiguity
export type { 
  ToastActionElement,
  ToastProps 
} from './toast';

// Ensure toast is exported from one place consistently
export { toast } from './use-toast';
