
// This is a helper file to make importing UI components easier
// and to avoid import errors when switching between @/components/ui and @/shared/ui

// Re-export everything from @/shared/ui
export * from '@/shared/ui';

// Helper to redirect old imports to new imports
export const getUIImport = (oldPath: string): string => {
  const componentName = oldPath.replace('@/components/ui/', '');
  return `@/shared/ui/${componentName}`;
};

// Export UI components aliases for better compatibility
export { 
  Button, buttonVariants 
} from '@/components/ui/button';

export {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';

export {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs';

export {
  Input
} from '@/components/ui/input';

export {
  Textarea
} from '@/components/ui/textarea';

export {
  Label
} from '@/components/ui/label';

export {
  Badge, badgeVariants
} from '@/components/ui/badge';

export {
  Avatar, AvatarFallback, AvatarImage
} from '@/components/ui/avatar';

export {
  Alert, AlertDescription, AlertTitle
} from '@/components/ui/alert';

export {
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';

export {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';

export {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

export {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from '@/components/ui/tooltip';

export {
  ScrollArea, ScrollBar
} from '@/components/ui/scroll-area';

export {
  Spinner
} from '@/components/ui/spinner';

// Re-export toast components and hooks
export { 
  Toaster 
} from '@/components/ui/toaster';

export {
  useToast,
  toast,
} from '@/components/ui/use-toast';

export type { 
  ToastActionElement, 
  ToastProps,
  ToastVariant
} from '@/components/ui/toast';

// Export additional UI components as needed
