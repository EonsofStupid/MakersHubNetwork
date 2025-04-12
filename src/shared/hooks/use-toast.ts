
import {
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/shared/ui/toast";

import { useToast as useToastUI } from "@/shared/ui/use-toast";

type ToasterToast = Toast & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

export const useToast = useToastUI;
export const toast = useToastUI().toast;

export type { ToasterToast };
