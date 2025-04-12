
import * as React from "react"
import {
  AlertCircle,
  CheckCircle,
  Info,
  X,
  XCircle,
} from "lucide-react"

import { ToastProps, ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction } from "@/shared/ui/toast"
import { useToast, ToastVariant } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  // Map variant to icon
  const getIconForVariant = (variant?: ToastVariant) => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "destructive":
        return <XCircle className="h-4 w-4" />;
      case "warning":
        return <AlertCircle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const IconComponent = getIconForVariant(props.variant as ToastVariant);
        
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="flex items-center gap-2">
                  {IconComponent && <span className="mr-2">{IconComponent}</span>}
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
