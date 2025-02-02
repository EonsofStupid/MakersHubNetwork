import { cn } from "@/lib/utils";

interface NavigationSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const NavigationSection = ({ children, className }: NavigationSectionProps) => {
  return (
    <div className={cn("flex items-center", className)}>
      {children}
    </div>
  );
};