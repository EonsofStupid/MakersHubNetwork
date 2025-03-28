
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { motion, AnimatePresence } from "framer-motion"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
        <AnimatePresence>
          {toasts.map(({ id, title, description, action, ...props }) => {
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: "spring", stiffness: 500, damping: 30, mass: 1 }}
              >
                <Toast {...props}>
                  <div className="grid gap-1">
                    {title && <ToastTitle>{title}</ToastTitle>}
                    {description && <ToastDescription>{description}</ToastDescription>}
                  </div>
                  {action}
                  <ToastClose />
                </Toast>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
      <ToastViewport />
    </ToastProvider>
  )
}

// Renamed for clarity - SystemToaster is the component used in the Shell
export function SystemToaster() {
  return <Toaster />
}
