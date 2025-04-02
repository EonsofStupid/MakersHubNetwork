
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/30", className)}
      style={{
        background: "linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 75%)",
        backgroundSize: "200% 100%",
        animation: "skeleton-loading 1.5s infinite",
      }}
      {...props}
    />
  )
}

export { Skeleton }
