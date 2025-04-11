
// Re-export from the UI core component
import { useToast as useToastCore, toast as toastCore } from "@/shared/ui/core/use-toast";

export const useToast = useToastCore;
export const toast = toastCore;
