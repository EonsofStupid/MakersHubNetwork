
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface DataCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
}

export const DataCard = ({ title, children, className, ...props }: DataCardProps) => {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden cyber-card", 
        "before:absolute before:inset-0 before:bg-gradient-to-br",
        "before:from-primary/5 before:via-secondary/5 before:to-primary/5",
        className
      )} 
      {...props}
    >
      {title && (
        <div className="px-6 py-4 border-b border-primary/20">
          <h3 className="text-lg font-heading font-bold bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent">
            {title}
          </h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </Card>
  );
};
