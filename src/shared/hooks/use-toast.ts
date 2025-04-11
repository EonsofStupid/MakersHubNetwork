
// Re-export from the shadcn/ui toast hook
import { useToast as useShadcnToast } from "@/shared/ui/core/use-toast";
import { toast as shadcnToast } from "@/shared/ui/core/use-toast";

export const useToast = useShadcnToast;
export const toast = shadcnToast;

export type { ToastProps, ToastActionElement } from "@/shared/ui/core/toast";
