
import { cn } from "@/lib/utils";
import { useSiteTheme } from "./SiteThemeProvider";

interface SimpleCyberTextProps {
  text: string;
  className?: string;
}

export function SimpleCyberText({ text, className }: SimpleCyberTextProps) {
  const { componentStyles } = useSiteTheme();
  const styles = componentStyles?.SimpleCyberText || {
    base: "relative inline-block",
    primary: "absolute -top-[2px] left-[2px] text-primary/40 z-10 skew-x-6",
    secondary: "absolute -bottom-[2px] left-[-2px] text-secondary/40 z-10 skew-x-[-6deg]"
  };

  return (
    <span className={cn(styles.base, className)}>
      {text}
      <span className={styles.primary}
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }}>
        {text}
      </span>
      <span className={styles.secondary}
          style={{ clipPath: 'polygon(0 50%, 100% 0, 100% 100%, 0 100%)' }}>
        {text}
      </span>
    </span>
  );
}
