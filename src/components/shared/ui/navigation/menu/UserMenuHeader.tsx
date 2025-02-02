import { UserCircle } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { motion } from "framer-motion";

export const UserMenuHeader = () => {
  const { user } = useAuthStore();

  return (
    <motion.div 
      className="p-4 border-b border-[#95bf0b]/20 bg-gradient-to-br from-[#1e0430] to-[#221a2b]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-3">
        <motion.div 
          className="flex-shrink-0"
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <UserCircle className="w-10 h-10 text-[#32f091]" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#f032c4] truncate">
            {user?.email}
          </p>
          <p className="text-xs text-[#08d489]">
            {user?.role?.toUpperCase()}
          </p>
        </div>
      </div>
    </motion.div>
  );
};