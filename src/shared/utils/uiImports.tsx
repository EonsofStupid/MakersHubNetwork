
import React from 'react';

// This is a helper file to make importing UI components easier
// Map old imports to new import paths

// Re-export all UI components
export * from '@/shared/ui';

// Card components
export {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/shared/ui/card';

// Button components
export { Button, buttonVariants } from '@/shared/ui/button';

// Form components
export { Input } from '@/shared/ui/input';
export { Label } from '@/shared/ui/label';
export { Textarea } from '@/shared/ui/textarea';
export { Checkbox } from '@/shared/ui/checkbox';
export { Switch } from '@/shared/ui/switch';
export { Slider } from '@/shared/ui/slider';
export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/shared/ui/select';
export { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';

// Navigation components
export { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
export { ScrollArea, ScrollBar } from '@/shared/ui/scroll-area';

// Feedback components
export { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
export { Badge, badgeVariants } from '@/shared/ui/badge';
export { Spinner } from '@/shared/ui/spinner';
export { Progress } from '@/shared/ui/progress';
export { Skeleton } from '@/shared/ui/skeleton';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';

// Layout components
export { Separator } from '@/shared/ui/separator';
export { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
export { HoverCard, HoverCardContent, HoverCardTrigger } from '@/shared/ui/hover-card';
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
export { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
export { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';
export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

// Toast notifications
export { Toaster } from '@/shared/ui/toaster';
export { useToast, toast } from '@/shared/ui/use-toast';

// Alert Dialog
export { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/shared/ui/alert-dialog';

// Helper function to convert old paths to new
export const getUIImportPath = (oldPath: string): string => {
  const componentName = oldPath.replace(/^@\/components\/ui\//, '');
  return `@/shared/ui/${componentName}`;
};
