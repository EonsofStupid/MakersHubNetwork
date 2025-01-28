import React from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ProfileDisplay } from "./ProfileDisplay"

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
        className="sm:max-w-[672px] backdrop-blur-xl bg-background/80
                   border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)]
                   p-0 overflow-hidden"
      >
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
            className="absolute right-2 top-2 z-50"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <ProfileDisplay />
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}