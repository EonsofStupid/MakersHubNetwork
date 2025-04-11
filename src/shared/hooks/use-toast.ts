
// Re-export from the shared toast implementation 
import { useToast as useToastInternal, type Toast, type ToastActionElement } from "@/lib/use-toast"

export type { Toast, ToastActionElement }

export const useToast = useToastInternal
export { toast } from "@/lib/use-toast"
