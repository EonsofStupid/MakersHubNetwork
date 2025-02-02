import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export const CardSkeleton = () => (
  <div className="relative bg-black/40 backdrop-blur-xl p-8 rounded-xl border border-white/10">
    <Skeleton className="h-8 w-2/3 bg-white/5 mb-4" />
    <Skeleton className="h-4 w-full bg-white/5 mb-2" />
    <Skeleton className="h-4 w-3/4 bg-white/5" />
  </div>
);

export const GridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array(count).fill(null).map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
      >
        <CardSkeleton />
      </motion.div>
    ))}
  </div>
);

export const SpinnerOverlay = ({ className }: { className?: string }) => (
  <div className={cn(
    "flex items-center justify-center min-h-[200px]",
    className
  )}>
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </motion.div>
  </div>
);

export const TableRowSkeleton = ({ columns = 4 }: { columns?: number }) => (
  <div className="flex space-x-4 p-4">
    {Array(columns).fill(null).map((_, index) => (
      <Skeleton 
        key={index}
        className={cn(
          "h-4 bg-white/5",
          index === 0 ? "w-1/4" : "flex-1"
        )}
      />
    ))}
  </div>
);