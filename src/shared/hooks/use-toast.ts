
import {
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/shared/ui/toast";

import { useToast as useToastBase } from "@/shared/ui/use-toast";

type ToasterToast = Toast & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

export const useToast = useToastBase;

export type { ToasterToast }
