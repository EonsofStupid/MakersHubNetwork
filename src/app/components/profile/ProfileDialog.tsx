
import React from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"

import { Button } from "@/shared/ui/button"
import { Dialog, DialogContent } from "@/shared/ui/dialog"
import { ProfileEditor } from "./ProfileEditor"

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
        className="sm:max-w-[425px] backdrop-blur-xl bg-background/80
                   border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)]
                   p-6 overflow-hidden"
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
            className="absolute right-0 top-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-primary">
              Edit Profile
            </h2>

            <ProfileEditor onSave={onClose} onCancel={onClose} />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
