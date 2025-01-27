import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProfileDialogProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
}

export function ProfileDialog({ children, trigger }: ProfileDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent 
        className={cn(
          "max-h-[90vh] w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw]",
          "p-0 overflow-hidden"
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="h-full flex flex-col"
        >
          <ScrollArea className="h-full p-6">
            <div className="space-y-6">
              {children}
            </div>
          </ScrollArea>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
} 