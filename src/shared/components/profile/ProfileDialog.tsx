import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ProfileDisplay } from "./ProfileDisplay"
import { ThemeDataStream } from "@/components/theme/ThemeDataStream"
import { cn } from "@/lib/utils"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface ProfileDialogProps {
  open: boolean
  onClose: () => void
}

export const ProfileDialog: React.FC<ProfileDialogProps> = ({
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "sm:max-w-[672px] p-0 overflow-hidden",
          "backdrop-blur-xl bg-background/80",
          "border-primary/20",
          "shadow-[0_0_20px_rgba(0,240,255,0.15)]",
          "before:absolute before:inset-0",
          "before:bg-gradient-to-b before:from-primary/5 before:to-transparent",
          "before:pointer-events-none",
          "max-h-[90vh]"
        )}
        aria-describedby="profile-dialog-description"
      >
        <DialogTitle className="sr-only">User Profile</DialogTitle>
        <div id="profile-dialog-description" className="sr-only">
          View and edit your user profile settings and preferences
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute right-2 top-2 z-50",
                "hover:bg-primary/10",
                "transition-colors duration-200"
              )}
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <VisuallyHidden>Close profile dialog</VisuallyHidden>
            </Button>

            <ScrollArea className="h-[calc(90vh-2rem)] w-full">
              <ThemeDataStream className="absolute inset-0 pointer-events-none opacity-20" />
              <ProfileDisplay />
            </ScrollArea>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}