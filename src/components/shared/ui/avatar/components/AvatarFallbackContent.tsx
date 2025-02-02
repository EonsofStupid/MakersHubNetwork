import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarFallbackContentProps {
  email?: string | null;
  className?: string;
}

export const AvatarFallbackContent = ({ email, className }: AvatarFallbackContentProps) => {
  return (
    <div className={cn(
      "bg-gradient-to-br from-[#41f0db]/20 to-[#8000ff]/20 text-white border border-white/10",
      "flex items-center justify-center w-full h-full",
      className
    )}>
      {email?.[0]?.toUpperCase() || <UserRound className="h-5 w-5 text-white/70" />}
    </div>
  );
};