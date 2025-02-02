import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface MobileNavTriggerProps {
  isOpen: boolean;
  onClick: () => void;
}

export const MobileNavTrigger = ({ isOpen, onClick }: MobileNavTriggerProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative md:hidden group hover:bg-transparent"
      onClick={onClick}
    >
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { rotate: 180 },
          closed: { rotate: 0 }
        }}
        transition={{ duration: 0.3 }}
      >
        {isOpen ? (
          <X className="h-5 w-5 text-white transition-colors duration-300 group-hover:text-[#41f0db]" />
        ) : (
          <Menu className="h-5 w-5 text-white transition-colors duration-300 group-hover:text-[#41f0db]" />
        )}
      </motion.div>
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#41f0db]/10 to-[#8000ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg -z-10 rounded-full" />
    </Button>
  );
};