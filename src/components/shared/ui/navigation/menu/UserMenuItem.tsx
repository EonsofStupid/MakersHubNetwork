import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface UserMenuItemProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

export const UserMenuItem = ({ icon: Icon, label, onClick, variant = 'default' }: UserMenuItemProps) => {
  const baseClasses = "flex items-center space-x-2 w-full p-3 text-sm text-left rounded-lg backdrop-blur-sm transition-all duration-300 group relative overflow-hidden";
  
  const colors = {
    default: [
      "bg-[#32f091]/10 hover:bg-[#32f091]/20 text-[#32f091]",
      "bg-[#f032c4]/10 hover:bg-[#f032c4]/20 text-[#f032c4]",
      "bg-[#08d489]/10 hover:bg-[#08d489]/20 text-[#08d489]"
    ],
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300"
  };

  // Cycle through colors based on label length for consistent but varied coloring
  const colorIndex = variant === 'default' ? label.length % colors.default.length : 0;
  const colorClass = variant === 'default' ? colors.default[colorIndex] : colors.danger;

  return (
    <motion.button
      onClick={onClick}
      className={`${baseClasses} ${colorClass}`}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="relative z-10 flex items-center space-x-2">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
    </motion.button>
  );
};