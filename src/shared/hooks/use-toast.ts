
// Re-export useToast from the UI component
import { toast, useToast as useToastUI } from "@/shared/ui/use-toast";

export { toast };
export const useToast = useToastUI;
