
/**
 * UI Components Export
 * 
 * This file re-exports all shadcn UI components from their proper locations.
 * Use this as a central point for importing UI components to ensure consistency.
 */

// Button components
export { Button, buttonVariants } from '@/shared/ui/button';

// Card components
export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/shared/ui/card';

// Form components
export { Input } from '@/shared/ui/input';
export { Label } from '@/shared/ui/label';
export { Textarea } from '@/shared/ui/textarea';
export { Checkbox } from '@/shared/ui/checkbox';
export { Switch } from '@/shared/ui/switch';
export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/ui/select';
export { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';

// Navigation components
export { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';

// Display components
export { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/avatar';
export { Badge, badgeVariants } from '@/shared/ui/badge';
export { Skeleton } from '@/shared/ui/skeleton';
export { Spinner } from '@/shared/ui/spinner';

// Feedback components
export { Alert, AlertTitle, AlertDescription } from '@/shared/ui/alert';
export { 
  AlertDialog, 
  AlertDialogTrigger, 
  AlertDialogContent, 
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from '@/shared/ui/alert-dialog';

// Layout components
export { ScrollArea, ScrollBar } from '@/shared/ui/scroll-area';
export { Separator } from '@/shared/ui/separator';
export { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from '@/shared/ui/dialog';

// Overlay components
export { 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent, 
  TooltipProvider 
} from '@/shared/ui/tooltip';
export { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from '@/shared/ui/popover';

// Table components
export { 
  Table, 
  TableHeader, 
  TableBody, 
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
} from '@/shared/ui/table';

// Toast notifications
export { Toaster } from '@/shared/ui/toaster';
export { toast, useToast } from '@/shared/ui/use-toast';
export type { ToastProps, ToastActionElement } from '@/shared/ui/toast';
