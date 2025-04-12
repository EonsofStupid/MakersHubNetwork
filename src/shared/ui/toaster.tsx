
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProps,
  ToastAction,
} from "@/shared/ui/toast"
import { useToast } from "@/shared/hooks/use-toast"
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/shared/utils/cn"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, icon, ...props }) {
        // Determine icon based on variant
        let IconComponent = null
        let variantStyle = ""
        
        if (variant === "destructive") {
          IconComponent = AlertCircle
          variantStyle = "text-destructive"
        } else if (variant === "success") {
          IconComponent = CheckCircle
          variantStyle = "text-green-500 dark:text-green-400"
        } else if (variant === "info") {
          IconComponent = Info
          variantStyle = "text-blue-500 dark:text-blue-400"
        } else if (variant === "warning") {
          IconComponent = AlertTriangle
          variantStyle = "text-amber-500 dark:text-amber-400"
        }
        
        return (
          <Toast key={id} {...props} variant={variant === "default" ? "default" : "destructive"}>
            <div className="flex gap-3">
              {IconComponent && (
                <div className={cn("mt-0.5", variantStyle)}>
                  <IconComponent className="h-5 w-5" />
                </div>
              )}
              <div className="flex-1 gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            
            {action && <ToastAction altText="Action">{action}</ToastAction>}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
