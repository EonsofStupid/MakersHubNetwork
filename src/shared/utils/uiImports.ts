
// This is a helper file to make importing UI components easier
// and to avoid import errors when switching between @/components/ui and @/shared/ui

// Re-export everything from @/shared/ui
export * from '@/shared/ui';

// Helper to redirect old imports to new imports
export const getUIImport = (oldPath: string): string => {
  const componentName = oldPath.replace('@/components/ui/', '');
  return `@/shared/ui/${componentName}`;
};

// The following components are re-exported from their actual locations
// to provide backward compatibility

// Button
export { 
  Button, buttonVariants 
} from '@/shared/ui/button';

// Layout components  
export {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/shared/ui/card';

// Navigation components
export {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/shared/ui/tabs';

// Form components
export {
  Input
} from '@/shared/ui/input';

export {
  Textarea
} from '@/shared/ui/textarea';

export {
  Label
} from '@/shared/ui/label';

export {
  Badge, badgeVariants
} from '@/shared/ui/badge';

export {
  Avatar, AvatarFallback, AvatarImage
} from '@/shared/ui/avatar';

export {
  Alert, AlertDescription, AlertTitle
} from '@/shared/ui/alert';

export {
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger
} from '@/shared/ui/dialog';

export {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger
} from '@/shared/ui/alert-dialog';

export {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/shared/ui/select';

export {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from '@/shared/ui/tooltip';

export {
  ScrollArea, ScrollBar
} from '@/shared/ui/scroll-area';

export {
  Spinner
} from '@/shared/ui/spinner';

// Re-export toast components and hooks
export { 
  Toaster 
} from '@/shared/ui/toaster';

export {
  useToast,
  toast,
} from '@/shared/ui/use-toast';

export type { 
  ToastActionElement, 
  ToastProps,
  ToastVariant
} from '@/shared/ui/toast';
