
import { cn } from "@/lib/utils";

interface SimpleCyberTextProps {
  text: string;
  className?: string;
}

export function SimpleCyberText({ text, className }: SimpleCyberTextProps) {
  return (
    <span className={cn("relative inline-block", className)}>
      {text}
      <span className="absolute -top-[2px] left-[2px] text-primary/40 z-10 skew-x-6"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }}>
        {text}
      </span>
      <span className="absolute -bottom-[2px] left-[-2px] text-secondary/40 z-10 skew-x-[-6deg]"
          style={{ clipPath: 'polygon(0 50%, 100% 0, 100% 100%, 0 100%)' }}>
        {text}
      </span>
    </span>
  );
}
